import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { InvoiceServices } from './invoice.service';

const createInvoice = catchAsync(async (req, res) => {
    const { applicationId, amount, description } = req.body;
    const result = await InvoiceServices.createInvoice(
        req.user.userId,
        applicationId,
        amount,
        description,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invoice created successfully',
        data: result,
    });
});

const getAllInvoices = catchAsync(async (req, res) => {
    const agentId = req.user.role === 'agent' ? req.user.userId : undefined;
    const result = await InvoiceServices.getAllInvoices(req.query, agentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invoices retrieved successfully',
        data: result,
    });
});

const getSingleInvoice = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.role === 'agent' ? req.user.userId : undefined;
    const result = await InvoiceServices.getSingleInvoice(id, agentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invoice retrieved successfully',
        data: result,
    });
});

const payInvoice = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    const result = await InvoiceServices.payInvoice(id, req.user.userId, paymentMethod);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invoice paid successfully',
        data: result,
    });
});

export const InvoiceControllers = {
    createInvoice,
    getAllInvoices,
    getSingleInvoice,
    payInvoice,
};
