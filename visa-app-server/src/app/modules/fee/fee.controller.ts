import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FeeServices } from './fee.service';

const getAllFeeSettings = catchAsync(async (req: Request, res: Response) => {
    const result = await FeeServices.getAllFeeSettings(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Fee settings retrieved successfully',
        data: result,
    });
});

const createFeeSetting = catchAsync(async (req: Request, res: Response) => {
    const result = await FeeServices.createFeeSetting(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Fee setting created successfully',
        data: result,
    });
});

const updateFeeSetting = catchAsync(async (req: Request, res: Response) => {
    const { key, ...updateData } = req.body;
    const result = await FeeServices.updateFeeSetting(key, updateData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Fee setting updated successfully',
        data: result,
    });
});

const deleteFeeSetting = catchAsync(async (req: Request, res: Response) => {
    const { key } = req.params;
    const result = await FeeServices.deleteFeeSetting(key);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Fee setting deleted successfully',
        data: result,
    });
});

const getApplicationFee = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FeeServices.calculateApplicationFee(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Application fee calculated successfully',
        data: result,
    });
});

export const FeeControllers = {
    getAllFeeSettings,
    createFeeSetting,
    updateFeeSetting,
    deleteFeeSetting,
    getApplicationFee
};
