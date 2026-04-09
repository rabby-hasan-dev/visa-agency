import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SettingsServices } from './settings.service';

const getSiteSettings = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.getSiteSettings();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Site settings retrieved successfully',
        data: result,
    });
});

const updateSiteSettings = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.updateSiteSettings(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Site settings updated successfully',
        data: result,
    });
});

const getNavigation = catchAsync(async (req: Request, res: Response) => {
    const { role } = req.query;
    const result = await SettingsServices.getNavigation(role as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Navigation retrieved successfully',
        data: result,
    });
});

const updateNavigation = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.updateNavigation(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Navigation updated successfully',
        data: result,
    });
});

const getGlobalOptions = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.getGlobalOptions();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Global options retrieved successfully',
        data: result,
    });
});

const updateGlobalOptions = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.updateGlobalOptions(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Global options updated successfully',
        data: result,
    });
});

const getPaymentConfig = catchAsync(async (_req: Request, res: Response) => {
    const result = await SettingsServices.getPaymentConfig();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment configuration retrieved successfully',
        data: result,
    });
});

const updatePaymentConfig = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.updatePaymentConfig(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment configuration updated successfully',
        data: result,
    });
});

const getCloudinaryConfig = catchAsync(async (_req: Request, res: Response) => {
    const result = await SettingsServices.getCloudinaryConfig();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cloudinary configuration retrieved successfully',
        data: result,
    });
});

const updateCloudinaryConfig = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.updateCloudinaryConfig(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cloudinary configuration updated successfully',
        data: result,
    });
});

const getAppConfig = catchAsync(async (_req: Request, res: Response) => {
    const result = await SettingsServices.getAppConfig();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'App configuration retrieved successfully',
        data: result,
    });
});

const updateAppConfig = catchAsync(async (req: Request, res: Response) => {
    const result = await SettingsServices.updateAppConfig(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'App configuration updated successfully',
        data: result,
    });
});

export const SettingsControllers = {
    getSiteSettings,
    updateSiteSettings,
    getNavigation,
    updateNavigation,
    getGlobalOptions,
    updateGlobalOptions,
    getPaymentConfig,
    updatePaymentConfig,
    getCloudinaryConfig,
    updateCloudinaryConfig,
    getAppConfig,
    updateAppConfig,
};
