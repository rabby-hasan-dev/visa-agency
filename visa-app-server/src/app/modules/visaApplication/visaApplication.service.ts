/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { VisaApplication } from './visaApplication.model';
import { Representation } from '../representation/representation.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { VISA_APPLICATION_STATUS, TVisaApplicationStatus } from './visaApplication.constant';
import { TVisaApplication, TAdminRequest } from './visaApplication.interface';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { ApplicantProfile } from '../applicantProfile/applicantProfile.model';
import { USER_ROLE } from '../user/user.constant';
import { FeeServices } from '../fee/fee.service';
import { UploadService } from '../upload/upload.service';

const generateTRN = async (): Promise<string> => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let isUnique = false;
    let trn = '';

    while (!isUnique) {
        trn = '';
        for (let i = 0; i < 10; i++) {
            trn += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const existing = await VisaApplication.findOne({ trn });
        if (!existing) isUnique = true;
    }

    return trn;
};

const enrichApplication = async (application: unknown) => {
    if (!application) return application;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app = application as any;

    const result = app.toObject ? app.toObject() : app;

    // Normalize visaTypeId to string
    if (result.visaTypeId && typeof result.visaTypeId === 'object' && result.visaTypeId._id) {
        result.visaTypeId = result.visaTypeId._id.toString();
    }

    // Attach ApplicantProfile data if it's there
    const clientUserId = result.clientId?._id || result.clientId;
    if (clientUserId && Types.ObjectId.isValid(clientUserId.toString())) {
        const profile = await ApplicantProfile.findOne({ userId: clientUserId });
        if (profile) {
            const client = result.clientId as any;
            if (client && typeof client === 'object') {
                client.dateOfBirth = profile.dateOfBirth;
                client.name = client.name || result.email || 'APPLICANT';
            }
            // Also store profile separately for easy access to address etc
            result.profile = profile.toObject();
        }
    }

    // LEGACY FALLBACK: If application doesn't have visaTypeId, find it by visaCategory name
    if (!result.visaTypeId) {
        const { VisaType } = await import('../visaType/visaType.model');
        const visaType = await VisaType.findOne({ name: result.visaCategory });
        if (visaType) {
            result.visaTypeId = visaType._id.toString();
        }
    }

    // GENERATE VLN DYNAMICALLY - controlled by admin panel (TransitCountry table)
    if (result.trn) {
        const applicantCountry = result.profile?.address?.country || result.profile?.nationality || result.nationality || "";
        let cCode = "MY"; // Default fallback

        if (applicantCountry) {
            // Check if this country and its code exists in the TransitCountry table managed by admin
            const { TransitCountry } = await import('../transitCountry/transitCountry.model');
            const countryEntry = await TransitCountry.findOne({
                name: { $regex: new RegExp(`^${applicantCountry.toString().trim()}$`, "i") },
                isActive: true,
            });

            if (countryEntry) {
                cCode = countryEntry.code;
            } else {
                // Hardcoded fallback logic for common countries if not found in DB
                const upperStr = applicantCountry.toString().toUpperCase();
                if (upperStr.includes("MALAYSIA")) cCode = "MY";
                else if (upperStr.includes("BANGLADESH")) cCode = "BD";
                else if (upperStr.includes("INDIA")) cCode = "IN";
                else if (upperStr.includes("PAKISTAN")) cCode = "PK";
                else if (upperStr.includes("CHINA")) cCode = "CN";
                else if (upperStr.includes("IRAN")) cCode = "IR";
                else if (upperStr.includes("SRI LANKA") || upperStr === "LK") cCode = "LK";
                else if (upperStr.includes("NEPAL")) cCode = "NP";
                else if (upperStr.includes("PHILIPPINES")) cCode = "PH";
                else if (upperStr.includes("INDONESIA")) cCode = "ID";
                else if (upperStr.includes("VIETNAM")) cCode = "VN";
                else if (upperStr.includes("THAILAND")) cCode = "TH";
                else if (upperStr.includes("BRAZIL")) cCode = "BR";
                else if (upperStr.length === 2) cCode = upperStr;
            }
        }
        result.vln = `AUE-${cCode}-66-${result.trn}-C`;
    }

    return result;
};

const getValFromFormData = (fd: any, key: string) => {
    if (!fd) return undefined;
    if (fd[key] !== undefined) return fd[key];
    // Check legacy step buckets
    for (let i = 1; i <= 10; i++) {
        const step = fd[`step${i}`];
        if (step && step[key] !== undefined) return step[key];
    }
    return undefined;
};

const syncApplicationDataToProfile = async (application: any) => {
    if (!application.clientId) return;

    const fd = (application.formData || {}) as Record<string, any>;
    const getVal = (key: string) => getValFromFormData(fd, key);

    const givenNames = getVal('givenNames');
    const familyName = getVal('familyName');
    const fullName = [givenNames, familyName].filter(Boolean).join(' ').trim();

    // 1. Update User
    const userUpdates: Record<string, any> = {};
    if (fullName) userUpdates.name = fullName;
    if (getVal('email')) userUpdates.email = getVal('email');
    if (getVal('mobilePhone')) userUpdates.mobilePhone = getVal('mobilePhone');
    if (getVal('businessPhone') || getVal('homePhone')) {
        userUpdates.phone = getVal('businessPhone') || getVal('homePhone');
    }

    if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(application.clientId, userUpdates);
    }

    // 1.1 Update applicantName on the Application itself (denormalization for search)
    if (fullName) {
       await VisaApplication.findByIdAndUpdate(application._id, { applicantName: fullName });
    }

    // 2. Update ApplicantProfile
    const profileUpdates: Record<string, any> = {};
    if (getVal('passportNumber')) profileUpdates.passportNumber = getVal('passportNumber');
    if (getVal('nationality')) profileUpdates.nationality = getVal('nationality');
    if (getVal('dateOfBirth')) profileUpdates.dateOfBirth = getVal('dateOfBirth');
    if (getVal('sex')) profileUpdates.gender = getVal('sex');
    if (getVal('dateOfIssue')) profileUpdates.dateOfIssue = getVal('dateOfIssue');
    if (getVal('dateOfExpiry')) profileUpdates.dateOfExpiry = getVal('dateOfExpiry');
    if (getVal('placeOfIssue')) profileUpdates.placeOfIssue = getVal('placeOfIssue');

    const address: Record<string, any> = {};
    if (getVal('country')) address.country = getVal('country');
    if (getVal('address')) address.street = getVal('address');
    if (getVal('address1')) address.street = getVal('address1');
    if (getVal('address2')) address.address2 = getVal('address2');
    if (getVal('city')) address.city = getVal('city');
    if (getVal('state')) address.state = getVal('state');
    if (getVal('zip') || getVal('zipCode')) address.zipCode = getVal('zip') || getVal('zipCode');

    if (Object.keys(address).length > 0) {
        profileUpdates.address = address;
    }

    if (Object.keys(profileUpdates).length > 0) {
        await ApplicantProfile.findOneAndUpdate(
            { userId: application.clientId },
            { $set: profileUpdates },
            { upsert: true, new: true }
        );
    }
};

const createVisaApplicationIntoDB = async (
    userId: string,
    role: string,
    organizationId: string,
    payload: { clientId?: string; email?: string; visaCategory: string; visaTypeId?: string }
) => {
    if (role === 'agent' && !payload.email) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Client Contact Email is required'
        );
    }

    const finalPayload: Partial<TVisaApplication> = {
        visaCategory: payload.visaCategory,
        status: VISA_APPLICATION_STATUS.DRAFT,
        currentStep: 1,
        formData: {},
        email: payload.email,
        trn: await generateTRN(),
        statusHistory: [
            {
                status: VISA_APPLICATION_STATUS.DRAFT,
                updatedBy: new Types.ObjectId(userId),
                updatedAt: new Date(),
            }
        ],
    };

    // Store visaTypeId for the new dynamic system
    if (payload.visaTypeId) {
        finalPayload.visaTypeId = new Types.ObjectId(payload.visaTypeId);
    }

    if (organizationId) {
        finalPayload.organizationId = new Types.ObjectId(organizationId);
    }

    if (role === 'agent') {
        // If clientId is provided, check authorization as before
        if (payload.clientId) {
            const isAuthorized = await Representation.findOne({
                agentId: userId,
                applicantId: payload.clientId,
                authorizationStatus: 'AUTHORIZED',
            });
            if (!isAuthorized) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'You are not authorized to represent this applicant'
                );
            }

            finalPayload.clientId = new Types.ObjectId(payload.clientId);
        }

        finalPayload.createdByAgentId = new Types.ObjectId(userId);
    } else if (role === 'applicant') {
        // Applicant can only create for themselves
        finalPayload.clientId = new Types.ObjectId(userId);
    } else {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Only agents or applicants can create applications'
        );
    }

    // Check for existing active application ONLY if clientId is present
    if (finalPayload.clientId) {
        const existingApp = await VisaApplication.findOne({
            clientId: finalPayload.clientId,
            status: {
                $in: [
                    VISA_APPLICATION_STATUS.DRAFT,
                    VISA_APPLICATION_STATUS.SUBMITTED,
                ],
            },
            isDeleted: false,
        });

        if (existingApp && role === 'agent') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'An active application already exists for this client'
            );
        }
    }

    const result = await VisaApplication.create(finalPayload);
    return result;
};

const updateVisaApplicationStepIntoDB = async (
    id: string,
    userId: string,
    role: string,
    step: number,
    data: Record<string, unknown>
) => {
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (role === 'agent') {
        query.createdByAgentId = userId;
    } else {
        query.clientId = userId;
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    if (application.status !== VISA_APPLICATION_STATUS.DRAFT) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot edit application after submission'
        );
    }

    // Merge all field keys directly into the flat formData object.
    // Also keep a stepN key for backwards-compat with legacy views.
    const stepKey = `step${step}`;
    const updateData: Record<string, unknown> = {};

    // Flat merge: each field key from the dynamic renderer goes directly into formData
    for (const [key, val] of Object.entries(data)) {
        // If the old value was a Cloudinary file, remove it
        const oldValue = application.formData ? (application.formData as any)[key] : undefined;
        if (typeof oldValue === 'string' && oldValue !== val) {
            const publicId = UploadService.extractPublicIdFromUrl(oldValue);
            if (publicId) {
                // Ignore errors to avoid breaking the update if file deletion fails
                UploadService.removeSingleFile(publicId).catch((err) =>
                    console.error('Error removing old file from Cloudinary:', err)
                );
            }
        }
        updateData[`formData.${key}`] = val;
    }

    // Legacy step bucket for compatibility with old views that read formData.stepN
    updateData[`formData.${stepKey}`] = data;

    // Promote email to root level if present
    if (data.email && typeof data.email === 'string') {
        updateData.email = data.email;
    }

    // Only advance currentStep forward
    if (step >= application.currentStep) {
        updateData.currentStep = step;
    }

    const result = await VisaApplication.findByIdAndUpdate(id, updateData, {
        new: true,
    });

    if (result && result.clientId) {
        await syncApplicationDataToProfile(result);
    }

    return result;
};



const submitVisaApplicationIntoDB = async (
    id: string,
    userId: string,
    role: string
) => {
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (role === 'admin' || role === 'superAdmin') {
        // Admins can submit any
    } else if (role === 'agent') {
        query.createdByAgentId = userId;
    } else {
        query.clientId = userId;
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found or unauthorized');
    }

    if (application.status !== VISA_APPLICATION_STATUS.DRAFT) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Application is already submitted or processed'
        );
    }

    // Agent-led or Admin-led application without clientId: Create the client/user now
    if (!application.clientId && (role === 'agent' || role === 'admin' || role === 'superAdmin')) {
        let email = application.email;
        const fd = (application.formData || {}) as Record<string, any>;
        const getVal = (key: string) => getValFromFormData(fd, key);

        if (!email) {
            email = getVal('email');
            if (email) application.email = email;
        }

        if (!email) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Contact email is required to finalize application. Please ensure contact details are provided in the form.'
            );
        }

        // 1. Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            const givenNames = getVal('givenNames') || '';
            const familyName = getVal('familyName') || '';
            const fullName = `${givenNames} ${familyName}`.trim() || 'Pending Account';

            // Create User
            user = await User.create({
                email,
                name: fullName,
                password: 'tempPassword123!',
                role: USER_ROLE.applicant,
                organizationId: application.organizationId,
                status: 'active',
            });

            // Create Applicant Profile
            await ApplicantProfile.create({
                userId: user._id,
                dateOfBirth: getVal('dateOfBirth') || new Date('1990-01-01'), // Fallback if missing
                passportNumber: getVal('passportNumber') || `PENDING-${Date.now()}`,
                nationality: getVal('nationality') || 'Unknown',
            });
        }

        // Link clientId to application
        application.clientId = user._id as unknown as Types.ObjectId;
        application.applicantName = user.name;
        await application.save();
    }

    // Always sync latest form data to profile on submission
    if (application.clientId) {
        await syncApplicationDataToProfile(application);
    }

    // Calculate Fees
    const { total, breakdown } = await FeeServices.calculateApplicationFee(id);

    // Mark as submitted
    const result = await VisaApplication.findByIdAndUpdate(
        id,
        {
            status: VISA_APPLICATION_STATUS.SUBMITTED,
            clientId: application.clientId,
            totalAmount: total,
            feeBreakdown: breakdown,
            $push: {
                statusHistory: {
                    status: VISA_APPLICATION_STATUS.SUBMITTED,
                    updatedBy: new Types.ObjectId(userId),
                    updatedAt: new Date(),
                }
            }
        },
        { new: true }
    ).populate('clientId').populate('createdByAgentId').populate('statusHistory.updatedBy');

    if (!result) return null;

    // Auto-create invoice for this application (idempotent — safe to call multiple times)
    try {
        const { InvoiceServices } = await import('../invoice/invoice.service');
        await InvoiceServices.createInvoiceForApplication(id);
    } catch (invoiceErr) {
        // Log but don't fail the submission — the application is already marked SUBMITTED
        console.error('[SUBMIT] Failed to auto-create invoice:', invoiceErr);
    }

    return await enrichApplication(result);
};

const getAllVisaApplicationsFromDB = async (
    userId: string,
    role: string,
    query: Record<string, unknown>
) => {
    const filter: Record<string, unknown> = { isDeleted: false };
    if (role === 'applicant') {
        filter.clientId = userId;
    } else if (role === 'agent') {
        filter.createdByAgentId = userId;
    }

    const visaApplicationQuery = new QueryBuilder(
        VisaApplication.find(filter)
            .populate('clientId')
            .populate('createdByAgentId')
            .populate('statusHistory.updatedBy'),
        query
    )
        .search(['visaCategory', 'trn', 'email', 'applicantName'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await visaApplicationQuery.countTotal();
    const result = await visaApplicationQuery.modelQuery;

    const enrichedResult = await Promise.all(result.map((app) => enrichApplication(app)));

    return {
        meta,
        result: enrichedResult,
    };
};

const getSingleVisaApplicationFromDB = async (id: string, userId: string, role: string) => {
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (role === 'agent') {
        query.createdByAgentId = userId;
    } else if (role === 'applicant') {
        query.clientId = userId;
    }

    let result = await VisaApplication.findOne(query)
        .populate('clientId')
        .populate('createdByAgentId')
        .populate('statusHistory.updatedBy');

    // If admin, they can view any
    if (!result && (role === 'admin' || role === 'superAdmin')) {
        result = await VisaApplication.findById(id)
            .populate('clientId')
            .populate('createdByAgentId')
            .populate('statusHistory.updatedBy');
    }

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found or unauthorized');
    }

    return await enrichApplication(result);
};

const submitUpdateRequestIntoDB = async (
    id: string,
    userId: string,
    role: string,
    payload: { type: string; data: Record<string, any>; }
) => {
    const { type, data: updateData } = payload;
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (role === 'agent') {
        query.createdByAgentId = userId;
    } else if (role === 'applicant') {
        query.clientId = userId;
    }

    const application = await VisaApplication.findOne(query).populate('clientId');

    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates = (application as any).updateRequests || [];
    updates.push({
        type,
        data: updateData,
        submittedAt: new Date(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (application as any).updateRequests = updates;

    await application.save();

    // Dynamically update profile/user data if it's one of these types
    if (type === 'address' && updateData.address_change === 'yes') {
        await ApplicantProfile.findOneAndUpdate(
            { userId: application.clientId },
            {
                $set: {
                    'address.street': updateData.address1 || updateData.address,
                    'address.address2': updateData.address2,
                    'address.city': updateData.city,
                    'address.state': updateData.state,
                    'address.country': updateData.country,
                    'address.zipCode': updateData.zip,
                }
            }
        );
    } else if (type === 'contact' && updateData.phone_available === 'yes') {
        const { User } = await import('../user/user.model');
        await User.findByIdAndUpdate(application.clientId, {
            phone: updateData.businessPhone || updateData.homePhone,
            mobilePhone: updateData.mobilePhone,
        });
    } else if (type === 'email' && updateData.email) {
        const clientUserId = (application.clientId as any)?._id || application.clientId;
        const { User } = await import('../user/user.model');
        await User.findByIdAndUpdate(clientUserId, { email: updateData.email });
        // Also update the contact email stored directly on the application
        await VisaApplication.findByIdAndUpdate(application._id, { email: updateData.email });
    } else if (type === 'passport') {
        const clientUserId = (application.clientId as any)?._id || application.clientId;

        // Update User name if familyName and givenNames are provided
        if (updateData.familyName || updateData.givenNames) {
            const { User } = await import('../user/user.model');
            const fullName = `${updateData.familyName || ''} ${updateData.givenNames || ''}`.trim();
            if (fullName) {
                await User.findByIdAndUpdate(clientUserId, { name: fullName });
            }
        }

        await ApplicantProfile.findOneAndUpdate(
            { userId: clientUserId },
            {
                $set: {
                    passportNumber: updateData.passportNumber,
                    nationality: updateData.countryOfPassport || updateData.nationality,
                    dateOfIssue: updateData.dateOfIssue ? new Date(updateData.dateOfIssue as string) : undefined,
                    dateOfExpiry: updateData.dateOfExpiry ? new Date(updateData.dateOfExpiry as string) : undefined,
                    placeOfIssue: updateData.placeOfIssue,
                }
            }
        );
    }

    return await enrichApplication(application);
};

const addDocumentsIntoDB = async (
    id: string,
    userId: string,
    role: string,
    documents: { url: string; originalName: string; documentType?: string; description?: string }[]
) => {
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (role === 'agent') {
        query.createdByAgentId = userId;
    } else if (role === 'applicant') {
        query.clientId = userId;
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    const currentDocs = application.documents || [];
    const documentsWithTime = documents.map((doc: any) => ({
        ...doc,
        uploadedAt: new Date(),
    }));
    const updatedDocs = [...currentDocs, ...documentsWithTime];

    const result = await VisaApplication.findByIdAndUpdate(
        id,
        { documents: updatedDocs },
        { new: true }
    );

    return result;
};

const removeDocumentFromDB = async (
    id: string,
    userId: string,
    role: string,
    documentUrl: string
) => {
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (role === 'agent') {
        query.createdByAgentId = userId;
    } else if (role === 'applicant') {
        query.clientId = userId;
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    const documentToRemove = application.documents?.find(doc => doc.url === documentUrl);

    if (!documentToRemove) {
        throw new AppError(httpStatus.NOT_FOUND, 'Document not found in application');
    }

    // 1. Remove from Cloudinary
    const { UploadService } = await import('../upload/upload.service');
    const publicId = UploadService.extractPublicIdFromUrl(documentUrl);
    if (publicId) {
        try {
            await UploadService.removeSingleFile(publicId);
        } catch (error) {
            console.error('Failed to remove file from Cloudinary:', error);
            // We continue even if Cloudinary fails, to keep DB in sync
        }
    }

    // 2. Remove from DB array
    const result = await VisaApplication.findByIdAndUpdate(
        id,
        { $pull: { documents: { url: documentUrl } } },
        { new: true }
    );

    return result;
};

const updateVisaApplicationStatusIntoDB = async (
    id: string,
    status: TVisaApplicationStatus,
    userId: string,
    remarks?: string
) => {
    const result = await VisaApplication.findByIdAndUpdate(
        id,
        {
            status,
            $push: {
                statusHistory: {
                    status,
                    updatedBy: new Types.ObjectId(userId),
                    updatedAt: new Date(),
                    remarks,
                }
            }
        },
        { new: true }
    ).populate('clientId').populate('createdByAgentId').populate('statusHistory.updatedBy');

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    return await enrichApplication(result);
};

const deleteVisaApplicationFromDB = async (id: string, userId: string, role: string) => {
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (role === 'agent') {
        query.createdByAgentId = userId;
    } else if (role === 'applicant') {
        query.clientId = userId;
    }

    const application = await VisaApplication.findOne(query);

    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    if (application.status !== VISA_APPLICATION_STATUS.DRAFT && role !== 'admin' && role !== 'superAdmin') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only draft applications can be deleted by clients/agents'
        );
    }

    const result = await VisaApplication.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );

    return result;
};

const addAdminRequestIntoDB = async (
    id: string,
    payload: Partial<TAdminRequest>,
) => {
    const application = await VisaApplication.findById(id);
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    const result = await VisaApplication.findByIdAndUpdate(
        id,
        {
            $push: {
                adminRequests: {
                    ...payload,
                    status: 'PENDING',
                    createdAt: new Date(),
                }
            }
        },
        { new: true }
    );

    return result;
};

const resolveAdminRequestInDB = async (
    id: string,
    requestId: string
) => {
    const application = await VisaApplication.findById(id);
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    const result = await VisaApplication.findOneAndUpdate(
        { _id: id, "adminRequests._id": requestId },
        {
            $set: {
                "adminRequests.$.status": 'RESOLVED',
                "adminRequests.$.resolvedAt": new Date()
            }
        },
        { new: true }
    );

    return result;
};

const importVisaApplicationsFromDB = async (
    userId: string,
    role: string,
    organizationId: string,
    applications: any[]
) => {
    const results = [];
    const errors = [];

    for (const appData of applications) {
        try {
            // 1. Basic Validation
            if (!appData.email) throw new Error('Email is required');
            if (!appData.visaCategory) throw new Error('Visa Category is required');

            // 2. Prepare Payload
            const finalPayload: Partial<TVisaApplication> = {
                visaCategory: appData.visaCategory,
                status: VISA_APPLICATION_STATUS.DRAFT,
                currentStep: 1,
                formData: appData.formData || {},
                email: appData.email,
                applicantName: appData.applicantName || appData.name,
                trn: await generateTRN(),
                statusHistory: [
                    {
                        status: VISA_APPLICATION_STATUS.DRAFT,
                        updatedBy: new Types.ObjectId(userId),
                        updatedAt: new Date(),
                    }
                ],
            };

            if (appData.visaTypeId) finalPayload.visaTypeId = new Types.ObjectId(appData.visaTypeId);
            if (organizationId) finalPayload.organizationId = new Types.ObjectId(organizationId);

            if (role === 'agent') {
                finalPayload.createdByAgentId = new Types.ObjectId(userId);
            }

            // 3. Create Application
            const result = await VisaApplication.create(finalPayload);
            results.push(result);
        } catch (err: any) {
            errors.push({ data: appData, message: err.message });
        }
    }

    return { 
        importedCount: results.length, 
        failedCount: errors.length,
        results, 
        errors 
    };
};

export const VisaApplicationServices = {
    createVisaApplicationIntoDB,
    updateVisaApplicationStepIntoDB,
    submitVisaApplicationIntoDB,
    getAllVisaApplicationsFromDB,
    getSingleVisaApplicationFromDB,
    submitUpdateRequestIntoDB,
    addDocumentsIntoDB,
    removeDocumentFromDB,
    updateVisaApplicationStatusIntoDB,
    deleteVisaApplicationFromDB,
    addAdminRequestIntoDB,
    resolveAdminRequestInDB,
    importVisaApplicationsFromDB
};
