import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { VisaTypeServices } from './visaType.service';

// ─── Create ────────────────────────────────────────────────────────────────────

const createVisaType = catchAsync(async (req: Request, res: Response) => {
    const result = await VisaTypeServices.createVisaTypeIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Visa type created successfully',
        data: result,
    });
});

// ─── Get All ───────────────────────────────────────────────────────────────────

const getAllVisaTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await VisaTypeServices.getAllVisaTypesFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Visa types retrieved successfully',
        data: result,
    });
});

// ─── Get Single ────────────────────────────────────────────────────────────────

const getSingleVisaType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await VisaTypeServices.getSingleVisaTypeFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Visa type retrieved successfully',
        data: result,
    });
});

// ─── Update ────────────────────────────────────────────────────────────────────

const updateVisaType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await VisaTypeServices.updateVisaTypeIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Visa type updated successfully',
        data: result,
    });
});

// ─── Delete ────────────────────────────────────────────────────────────────────

const deleteVisaType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await VisaTypeServices.deleteVisaTypeFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Visa type deleted successfully',
        data: result,
    });
});

// ─── Toggle Active ─────────────────────────────────────────────────────────────

const toggleVisaTypeActive = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await VisaTypeServices.toggleVisaTypeActiveStatus(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Visa type ${result?.isActive ? 'activated' : 'deactivated'} successfully`,
        data: result,
    });
});

export const VisaTypeControllers = {
    createVisaType,
    getAllVisaTypes,
    getSingleVisaType,
    updateVisaType,
    deleteVisaType,
    toggleVisaTypeActive,
};
