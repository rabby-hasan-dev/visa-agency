import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { VisaApplicationServices } from './visaApplication.service';
import { JwtPayload } from 'jsonwebtoken';
import { UploadService } from '../upload/upload.service';
import { FOLDERS } from '../../constant';

const createVisaApplication = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    // Assuming organizationId comes from user or body. Centralized user might have organizationId.
    const organizationId = user.organizationId || req.body.organizationId;

    const result = await VisaApplicationServices.createVisaApplicationIntoDB(
        user.userId,
        user.role,
        organizationId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Visa application created successfully',
        data: result,
    });
});

const updateVisaApplicationStep = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;
    const { step, data } = req.body;

    const result = await VisaApplicationServices.updateVisaApplicationStepIntoDB(
        id,
        user.userId,
        user.role,
        Number(step),
        data
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Application step updated successfully',
        data: result,
    });
});

const submitVisaApplication = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;

    const result = await VisaApplicationServices.submitVisaApplicationIntoDB(
        id,
        user.userId,
        user.role
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Application submitted successfully',
        data: result,
    });
});

const getAllVisaApplications = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const result = await VisaApplicationServices.getAllVisaApplicationsFromDB(
        user.userId,
        user.role,
        req.query
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Visa applications retrieved successfully',
        data: result,
    });
});

const getSingleVisaApplication = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;

    const result = await VisaApplicationServices.getSingleVisaApplicationFromDB(
        id,
        user.userId,
        user.role
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Visa application retrieved successfully',
        data: result,
    });
});

const submitUpdateRequest = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;

    const result = await VisaApplicationServices.submitUpdateRequestIntoDB(
        id,
        user.userId,
        user.role,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Update request submitted successfully',
        data: result,
    });
});

const addDocuments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;
    let documents = [];
    if (req.body.documents) {
        const rawDocuments = typeof req.body.documents === 'string' 
            ? JSON.parse(req.body.documents) 
            : req.body.documents;
        documents = Array.isArray(rawDocuments) ? rawDocuments : [rawDocuments];
    }

    // Handle file upload if present
    if (req.files) {
        const uploadResults = await UploadService.uploadMultipleFiles(req.files, {
            folder: FOLDERS.DOCUMENTS,
        });

        const newDocuments = uploadResults.map(result => ({
            url: result.secure_url,
            originalName: result.original_filename || 'document',
            documentType: 'other', // Default or derived from field names if needed
        }));

        documents = [...documents, ...newDocuments];
    }

    const result = await VisaApplicationServices.addDocumentsIntoDB(
        id,
        user.userId,
        user.role,
        documents
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Documents added successfully',
        data: result,
    });
});

const removeDocument = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;
    const { documentUrl } = req.body;

    if (!documentUrl) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Document URL is required');
    }

    const result = await VisaApplicationServices.removeDocumentFromDB(
        id,
        user.userId,
        user.role,
        documentUrl
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Document removed successfully',
        data: result,
    });
});

const updateVisaApplicationStatus = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;
    const { status, remarks } = req.body;

    const result = await VisaApplicationServices.updateVisaApplicationStatusIntoDB(
        id,
        status,
        user.userId,
        remarks
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Application status updated successfully',
        data: result,
    });
});

const deleteVisaApplication = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const { id } = req.params;

    const result = await VisaApplicationServices.deleteVisaApplicationFromDB(
        id,
        user.userId,
        user.role
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Application deleted successfully',
        data: result,
    });
});

const addAdminRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await VisaApplicationServices.addAdminRequestIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin request added successfully',
        data: result,
    });
});

const resolveAdminRequest = catchAsync(async (req: Request, res: Response) => {
    const { id, requestId } = req.params;
    const result = await VisaApplicationServices.resolveAdminRequestInDB(id, requestId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin request resolved successfully',
        data: result,
    });
});

const importVisaApplications = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const organizationId = user.organizationId || req.body.organizationId;
    
    const result = await VisaApplicationServices.importVisaApplicationsFromDB(
        user.userId,
        user.role,
        organizationId,
        req.body.applications
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Applications imported successfully',
        data: result,
    });
});

export const VisaApplicationControllers = {
    createVisaApplication,
    updateVisaApplicationStep,
    submitVisaApplication,
    getAllVisaApplications,
    getSingleVisaApplication,
    submitUpdateRequest,
    addDocuments,
    removeDocument,
    updateVisaApplicationStatus,
    deleteVisaApplication,
    addAdminRequest,
    resolveAdminRequest,
    importVisaApplications
};
