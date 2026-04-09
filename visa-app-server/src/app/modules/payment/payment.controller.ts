import { Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';
import config from '../../config';

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const { applicationId, amount, currency, gateway, clientId, clientName, clientEmail } = req.body;

    const paymentData = await PaymentService.initiatePayment({
        applicationId,
        clientId,
        amount,
        currency: currency || 'BDT',
        gateway,
        clientName,
        clientEmail
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment initiated successfully',
        data: paymentData,
    });
});

// SSLCommerz posts to this URL after payment (browser redirect + IPN)
// After verifying, we redirect the browser to the appropriate frontend page
const handleWebhook = async (req: Request, res: Response) => {
    const { gateway } = req.params;
    const tx = req.query.tx as string;
    const body = req.body as Record<string, unknown>;

    const siteUrl = config.client_site_url || 'http://localhost:3000';

    // Resolve transaction ID from query param or body
    const transactionId = (tx || body?.tran_id || body?.client_reference_id) as string;

    try {
        const isVerifiedAndProcessed = await PaymentService.handleWebhook(gateway, tx, body);

        if (isVerifiedAndProcessed) {
            // Browser redirect — user sees the success page
            return res.redirect(302, `${siteUrl}/payments/success?tx=${transactionId}`);
        } else {
            return res.redirect(302, `${siteUrl}/payment-failed?tx=${transactionId}`);
        }
    } catch (error) {
        console.error('[WEBHOOK] Unhandled error:', error);
        return res.redirect(302, `${siteUrl}/payment-failed?tx=${transactionId}`);
    }
};

const getPaymentByTransaction = catchAsync(async (req: Request, res: Response) => {
    const { tx } = req.params;
    const result = await PaymentService.getPaymentByTransactionId(tx);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment retrieved successfully',
        data: result,
    });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getAllPaymentsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payments retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PaymentService.getSinglePaymentFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment retrieved successfully',
        data: result,
    });
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getPaymentStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: result,
    });
});

const getAccountingReport = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getAccountingReport(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Accounting report retrieved successfully',
        data: result,
    });
});

export const PaymentControllers = {
    initiatePayment,
    handleWebhook,
    getPaymentByTransaction,
    getAllPayments,
    getSinglePayment,
    getPaymentStats,
    getAccountingReport,
};
