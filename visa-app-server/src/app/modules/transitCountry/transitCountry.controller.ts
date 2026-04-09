import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { TransitCountryServices } from './transitCountry.service';

// ─── Create ────────────────────────────────────────────────────────────────────

const createTransitCountry = catchAsync(async (req: Request, res: Response) => {
    const result = await TransitCountryServices.createTransitCountryIntoDB(
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Transit country created successfully',
        data: result,
    });
});

// ─── Get All (admin list – paginated/searchable) ─────────────────────────────

const getAllTransitCountries = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await TransitCountryServices.getAllTransitCountriesFromDB(req.query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Transit countries retrieved successfully',
            data: result,
        });
    },
);

// ─── Get Active Only (used by visa application form) ─────────────────────────

const getActiveTransitCountries = catchAsync(
    async (_req: Request, res: Response) => {
        const result =
            await TransitCountryServices.getActiveTransitCountriesFromDB();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Active transit countries retrieved successfully',
            data: result,
        });
    },
);

// ─── Get Single ────────────────────────────────────────────────────────────────

const getSingleTransitCountry = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await TransitCountryServices.getSingleTransitCountryFromDB(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Transit country retrieved successfully',
            data: result,
        });
    },
);

// ─── Update ────────────────────────────────────────────────────────────────────

const updateTransitCountry = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TransitCountryServices.updateTransitCountryIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Transit country updated successfully',
        data: result,
    });
});

// ─── Delete ────────────────────────────────────────────────────────────────────

const deleteTransitCountry = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
        await TransitCountryServices.deleteTransitCountryFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Transit country deleted successfully',
        data: result,
    });
});

// ─── Toggle Active ─────────────────────────────────────────────────────────────

const toggleTransitCountryActive = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await TransitCountryServices.toggleTransitCountryActiveStatus(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `Transit country ${result?.isActive ? 'activated' : 'deactivated'} successfully`,
            data: result,
        });
    },
);

// ─── Bulk Toggle Active ────────────────────────────────────────────────────────

const bulkToggleTransitCountriesActive = catchAsync(
    async (req: Request, res: Response) => {
        const { ids, isActive } = req.body as {
            ids: string[];
            isActive: boolean;
        };
        const result =
            await TransitCountryServices.bulkToggleTransitCountriesStatus(
                ids,
                isActive,
            );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `${result.modifiedCount} transit countries ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: result,
        });
    },
);

export const TransitCountryControllers = {
    createTransitCountry,
    getAllTransitCountries,
    getActiveTransitCountries,
    getSingleTransitCountry,
    updateTransitCountry,
    deleteTransitCountry,
    toggleTransitCountryActive,
    bulkToggleTransitCountriesActive,
};
