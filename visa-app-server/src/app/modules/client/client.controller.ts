import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ClientServices } from './client.service';

const createClient = catchAsync(async (req, res) => {
    const result = await ClientServices.createClient({
        ...req.body,
        agentId: req.user.userId,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Client created successfully',
        data: result,
    });
});

const getAllClients = catchAsync(async (req, res) => {
    const result = await ClientServices.getAllClients(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Clients retrieved successfully',
        data: result,
    });
});

const getSingleClient = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ClientServices.getSingleClient(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Client retrieved successfully',
        data: result,
    });
});

const updateClient = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ClientServices.updateClient(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Client updated successfully',
        data: result,
    });
});

const deleteClient = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ClientServices.deleteClient(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Client deleted successfully',
        data: result,
    });
});

export const ClientControllers = {
    createClient,
    getAllClients,
    getSingleClient,
    updateClient,
    deleteClient,
};
