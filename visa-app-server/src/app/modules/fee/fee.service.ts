import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { FeeSetting, TFeeSetting } from './fee.model';
import { TransitCountry } from '../transitCountry/transitCountry.model';
import { VisaApplication } from '../visaApplication/visaApplication.model';
import { TVisaType } from '../visaType/visaType.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllFeeSettings = async (query: Record<string, unknown>) => {
    const feeSettingQuery = new QueryBuilder(FeeSetting.find(), query)
        .search(['name', 'key', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await feeSettingQuery.countTotal();
    const result = await feeSettingQuery.modelQuery;

    return { meta, result };
};

const createFeeSetting = async (payload: TFeeSetting) => {
    const existing = await FeeSetting.findOne({ key: payload.key });
    if (existing) {
        throw new AppError(httpStatus.CONFLICT, 'A fee setting with this key already exists');
    }
    return await FeeSetting.create(payload);
};

const updateFeeSetting = async (key: string, payload: Partial<TFeeSetting>) => {
    const result = await FeeSetting.findOneAndUpdate(
        { key },
        payload,
        { new: true, upsert: true }
    );
    return result;
};

const deleteFeeSetting = async (key: string) => {
    const result = await FeeSetting.findOneAndDelete({ key });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Fee setting not found');
    }
    return result;
};

const calculateApplicationFee = async (applicationId: string) => {
    const application = await VisaApplication.findById(applicationId)
        .populate('visaTypeId');
    
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    // FALLBACK: If application doesn't have visaTypeId but has category name, find and attach it in memory
    // This handles older applications or flows where only category name was set originally
    if (!application.visaTypeId && application.visaCategory) {
        const { VisaType } = await import('../visaType/visaType.model');
        const visaType = await VisaType.findOne({ name: application.visaCategory });
        if (visaType) {
            // Re-fetch or manually attach to ensure calculation works correctly
            (application as unknown as { visaTypeId: any }).visaTypeId = visaType;
        }
    }

    const visaType = application.visaTypeId as unknown as TVisaType;
    const formData = application.formData as Record<string, unknown>;
    let total = 0;
    const breakdown = [];

    if (visaType) {
        if (visaType.baseFee) {
            total += visaType.baseFee;
            breakdown.push({ label: 'Visa Base Fee', amount: visaType.baseFee });
        }
        if (visaType.biometricFee) {
            total += visaType.biometricFee;
            breakdown.push({ label: 'Biometric Fee', amount: visaType.biometricFee });
        }
        if (visaType.serviceFee) {
            total += visaType.serviceFee;
            breakdown.push({ label: 'Service Fee', amount: visaType.serviceFee });
        }
    }

    // Country surcharge & Currency rules
    let targetCurrency = visaType?.currency || 'AUD';
    let exchangeRate = 1;

    const applicantCountry = (formData?.country as string) || (formData?.step1 as Record<string, unknown>)?.country as string;
    if (applicantCountry) {
        const country = await TransitCountry.findOne({
            name: { $regex: new RegExp(`^${applicantCountry}$`, 'i') }
        });
        if (country) {
            if (country.surcharge) {
                total += country.surcharge;
                breakdown.push({ label: `Country Surcharge (${country.name})`, amount: country.surcharge });
            }
            if (country.currency) {
                targetCurrency = country.currency;
            }
            if (country.exchangeRate && country.exchangeRate > 0) {
                exchangeRate = country.exchangeRate;
            }
        }
    }

    // Document fee (if any global documents fee exist)
    const docFeeSetting = await FeeSetting.findOne({ key: 'DOCUMENT_PROCESSING_FEE', isActive: true });
    if (docFeeSetting && application.documents?.length) {
        const docTotal = docFeeSetting.amount * application.documents.length;
        total += docTotal;
        breakdown.push({ label: 'Document Processing Fee', amount: docTotal });
    }

    // Agency Consultation Fee (Mandatory if active)
    const agencyFee = await FeeSetting.findOne({ key: 'AGENCY_CONSULTATION_FEE', isActive: true });
    if (agencyFee) {
        total += agencyFee.amount;
        breakdown.push({ label: 'Agency Consultation Fee', amount: agencyFee.amount });
    }

    // Urgent Processing Fee
    const isUrgent = (formData?.step1 as Record<string, unknown>)?.isUrgent || formData?.isUrgent;
    if (isUrgent) {
        const urgentFee = await FeeSetting.findOne({ key: 'EXPRESS_PROCESSING_FEE', isActive: true });
        if (urgentFee) {
            total += urgentFee.amount;
            breakdown.push({ label: 'Express Processing Fee', amount: urgentFee.amount });
        }
    }

    // Courier Fee
    const needsCourier = (formData?.step1 as Record<string, unknown>)?.needsCourier || formData?.needsCourier;
    if (needsCourier) {
        const courierFee = await FeeSetting.findOne({ key: 'COURIER_FEE', isActive: true });
        if (courierFee) {
            total += courierFee.amount;
            breakdown.push({ label: 'Passport Courier Fee', amount: courierFee.amount });
        }
    }

    // Apply currency exchange rate
    if (exchangeRate !== 1) {
        total = total * exchangeRate;
        for (const item of breakdown) {
            item.amount = item.amount * exchangeRate;
        }
    }

    return { total, breakdown, currency: targetCurrency };
};

export const FeeServices = {
    getAllFeeSettings,
    createFeeSetting,
    updateFeeSetting,
    deleteFeeSetting,
    calculateApplicationFee
};
