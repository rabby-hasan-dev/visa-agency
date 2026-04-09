import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getDashboardStats = catchAsync(async (req, res) => {
    const result = await AdminServices.getDashboardStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: result,
    });
});

const getAgentPerformance = catchAsync(async (req, res) => {
    const result = await AdminServices.getAgentPerformance();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Agent performance retrieved successfully',
        data: result,
    });
});

const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admins retrieved successfully',
        data: result,
    });
});

const updateAdminStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await AdminServices.updateAdminStatusInDB(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin status updated successfully',
        data: result,
    });
});

const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.deleteAdminFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin deleted successfully',
        data: result,
    });
});

export const AdminControllers = {
    getDashboardStats,
    getAgentPerformance,
    getAllAdmins,
    updateAdminStatus,
    deleteAdmin
};
