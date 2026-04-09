import { Types } from 'mongoose';
import { Payment } from './payment.model';
import { PaymentLog } from './paymentLog.model';
import { TPaymentGateway, IPaymentInitiateParams } from './payment.interface';
import { PaymentGatewayFactory } from './payment.utils';
import { VisaApplication } from '../visaApplication/visaApplication.model';
import { VISA_APPLICATION_STATUS } from '../visaApplication/visaApplication.constant';
import { Invoice } from '../invoice/invoice.model';
import { generatePDF } from '../pdf/utils/pdfGenerator';
import { sendEmail } from '../email/email.service';
import { TUser } from '../user/user.interface';
import { TVisaApplication } from '../visaApplication/visaApplication.interface';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { SettingsServices } from '../settings/settings.service';
import { FeeServices } from '../fee/fee.service';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Robust auditing logger
const auditLog = async (transactionId: string, action: string, gateway: string, payload?: unknown, error?: unknown, paymentId?: Types.ObjectId) => {
    try {
        await PaymentLog.create({
            paymentId,
            transactionId,
            action,
            gateway,
            payload,
            error
        });
    } catch {
        // Failed to write audit log — intentionally silent
    }
};

export const PaymentService = {
    async initiatePayment(data: {
        applicationId: string;
        clientId: string;
        amount: number;
        currency?: string;
        gateway: TPaymentGateway;
        clientName: string;
        clientEmail: string;
    }) {
        if (!data.applicationId || !Types.ObjectId.isValid(data.applicationId)) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Application ID');
        }

        const application = await VisaApplication.findById(data.applicationId);
        if (!application) {
            throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
        }

        // 1. Re-calculate Fee (Security First: do not trust amount from client)
        const { total: calculatedAmount, breakdown: calculatedBreakdown, currency: calculatedCurrency } = await FeeServices.calculateApplicationFee(data.applicationId);
        
        // SYNC: Update application and any existing invoice with the fresh amounts
        await VisaApplication.findByIdAndUpdate(data.applicationId, {
            totalAmount: calculatedAmount,
            feeBreakdown: calculatedBreakdown,
            currency: calculatedCurrency || 'AUD'
        });

        await Invoice.findOneAndUpdate(
            { applicationId: data.applicationId, isDeleted: false },
            { amount: calculatedAmount, currency: calculatedCurrency || 'AUD' }
        );

        const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const currency = calculatedCurrency || data.currency || 'AUD';

        // Use clientId from request, or fallback to the one stored in the application
        const agentId = application?.createdByAgentId;
        const clientId = (data.clientId && Types.ObjectId.isValid(data.clientId)) 
            ? data.clientId 
            : application?.clientId;

        if (!clientId || !Types.ObjectId.isValid(clientId.toString())) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Valid Client ID is required to initiate payment');
        }

        // 2. Create Pending Payment Record
        const payment = await Payment.create({
            applicationId: new Types.ObjectId(data.applicationId),
            clientId: new Types.ObjectId(clientId.toString()),
            agentId: agentId ? new Types.ObjectId(agentId.toString()) : undefined,
            amount: calculatedAmount,
            currency: currency,
            status: 'pending',
            gateway: data.gateway,
            transactionId: transactionId,
        });

        try {
            // 3. Log initialization
            await auditLog(transactionId, 'INITIATED', data.gateway, { amount: calculatedAmount, currency }, null, payment._id);

            // 3. Obtain gateway service via Factory (async — loads DB credentials)
            const service = await PaymentGatewayFactory.getService(data.gateway);

            const appConfig = await SettingsServices.getAppConfig();

            // 4. Build URLs: success goes to backend webhook (which verifies then redirects to frontend)
            const siteUrl = appConfig.clientSiteUrl || config.client_site_url || 'http://localhost:3000';
            const backendUrl = appConfig.backendBaseUrl || config.backend_base_url || 'http://localhost:5000/api/v1';

            const siteSettings = await SettingsServices.getSiteSettings();

            const initiateParams: IPaymentInitiateParams = {
                amount: calculatedAmount,
                currency,
                transactionId,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                applicationId: data.applicationId,
                // Browser lands here after payment → backend verifies → redirects to frontend
                successUrl: `${backendUrl}/payments/webhook/${data.gateway}?tx=${transactionId}`,
                failUrl: `${siteUrl}/payment-failed?tx=${transactionId}`,
                cancelUrl: `${siteUrl}/payment-cancelled?tx=${transactionId}`,
                // IPN: server-to-server notification (same endpoint for robustness)
                ipnUrl: `${backendUrl}/payments/webhook/${data.gateway}?tx=${transactionId}`,
                logoUrl: siteSettings?.logoUrl || undefined,
                storeName: siteSettings?.siteName,
                themeColor: siteSettings?.themeColor || '#00264d',
            };

            const result = await service.initiatePayment(initiateParams);

            // Update response data for record
            await Payment.findByIdAndUpdate(payment._id, {
                paymentResponse: result.gatewayResponse
            });

            return {
                paymentUrl: result.paymentUrl,
                transactionId: result.transactionId
            };

        } catch (error: unknown) {
            await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
            await auditLog(transactionId, 'FAILED', data.gateway, null, error, payment._id);
            throw error;
        }
    },

    async handleWebhook(gateway: string, queryTx: string, webhookPayload: Record<string, unknown>) {
        const transactionId = (queryTx || webhookPayload.tran_id || webhookPayload.client_reference_id) as string;

        if (!transactionId) {
            return false;
        }

        try {
            await auditLog(transactionId, 'WEBHOOK_RECEIVED', gateway, webhookPayload);

            const paymentRecord = await Payment.findOne({ transactionId });
            if (!paymentRecord) {
                throw new Error('Payment record not found for transaction: ' + transactionId);
            }

            // Idempotency: already processed
            if (paymentRecord.status === 'success') {
                return true;
            }

            const service = await PaymentGatewayFactory.getService(paymentRecord.gateway as TPaymentGateway);
            const isVerified = await service.verifyPayment(transactionId, webhookPayload);

            if (isVerified) {
                paymentRecord.status = 'success';
                await paymentRecord.save();
                await auditLog(transactionId, 'VERIFIED', gateway, null, null, paymentRecord._id);

                // Notify downstream: mark app paid, mark invoice paid, send email
                await this.postPaymentSuccessHook(paymentRecord);
                return true;
            } else {
                paymentRecord.status = 'failed';
                await paymentRecord.save();
                await auditLog(transactionId, 'FAILED', gateway, { reason: 'Gateway verification failed' }, null, paymentRecord._id);
                return false;
            }

        } catch (error: unknown) {
            const err = error as Error;
            await auditLog(transactionId, 'FAILED', gateway, null, err.message || err);
            throw error;
        }
    },

    async postPaymentSuccessHook(payment: { applicationId: Types.ObjectId | string; _id: Types.ObjectId; transactionId: string; gateway: string; }) {
        const applicationId = payment.applicationId;

        try {
            // 1. Mark application PAID
            const updatedApp = await VisaApplication.findByIdAndUpdate(applicationId, {
                status: VISA_APPLICATION_STATUS.PAID,
                paymentId: payment._id,
            }, { new: true }).populate('clientId').populate('createdByAgentId') as unknown as TVisaApplication & { _id: string };

            // 2. Mark invoice as PAID (find by applicationId)
            await Invoice.findOneAndUpdate(
                { applicationId, isDeleted: false },
                {
                    status: 'paid',
                    paidAt: new Date(),
                    paymentMethod: payment.gateway === 'sslcommerz' ? 'SSLCommerz' : 'Stripe',
                },
                { new: true }
            );

            if (updatedApp) {
                const client = updatedApp.clientId as unknown as TUser & { passportNumber?: string };
                const agent = updatedApp.createdByAgentId as unknown as TUser | null;

                // 3. Generate PDF
                const pdfBuffer = await generatePDF({
                    applicationId: updatedApp._id,
                    clientName: client?.name || 'Applicant',
                    passportNumber: client?.passportNumber || 'N/A',
                    status: updatedApp.status,
                    date: new Date().toLocaleDateString(),
                    formData: updatedApp.formData,
                });

                // 4. Send Email to agent first, then client
                const recipientEmail = agent?.email || client?.email || updatedApp.email;
                if (recipientEmail) {
                    await sendEmail(
                        recipientEmail,
                        'Visa Application Payment Successful — Receipt',
                        `Payment received for application ${updatedApp._id}. Your application is now being processed. Please find the application summary attached.`,
                        [
                            {
                                filename: `application-${updatedApp._id}.pdf`,
                                content: Buffer.from(pdfBuffer),
                                contentType: 'application/pdf',
                            },
                        ],
                    );
                }
            }
        } catch (hookError) {
            await auditLog(payment.transactionId, 'HOOK_FAILED', payment.gateway, { applicationId }, hookError, payment._id);
        }
    },

    async getPaymentByTransactionId(transactionId: string) {
        const payment = await Payment.findOne({ transactionId })
            .populate({
                path: 'applicationId',
                populate: [
                    { path: 'clientId', select: 'name email' },
                    { path: 'visaTypeId', select: 'name category' },
                ],
            })
            .populate('clientId', 'name email');

        if (!payment) {
            throw new Error('Payment not found for transaction: ' + transactionId);
        }

        const invoice = await Invoice.findOne({ applicationId: payment.applicationId })
            .populate('applicationId')
            .populate('clientId', 'name email');

        return { payment, invoice };
    },

    async getAllPaymentsFromDB(query: Record<string, unknown>) {
        const paymentQuery = new QueryBuilder(
            Payment.find().populate('applicationId').populate('clientId', 'name email passportNumber').populate('agentId', 'name email'),
            query,
        )
            .filter()
            .sort()
            .paginate()
            .fields();

        const meta = await paymentQuery.countTotal();
        const result = await paymentQuery.modelQuery;

        return { meta, result };
    },

    async getSinglePaymentFromDB(id: string) {
        const result = await Payment.findById(id)
            .populate('applicationId')
            .populate('clientId');

        if (!result) {
            throw new Error('Payment not found');
        }
        return result;
    },

    async getPaymentStats() {
        const stats = await Payment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        return stats;
    },

    async getAccountingReport(query: { startDate?: string; endDate?: string }) {
        const dateFilter: Record<string, { $gte?: Date; $lte?: Date }> = {};
        if (query.startDate || query.endDate) {
            dateFilter.createdAt = {};
            if (query.startDate) dateFilter.createdAt.$gte = new Date(query.startDate);
            if (query.endDate) dateFilter.createdAt.$lte = new Date(query.endDate);
        }

        // 1. Money Flow breakdown by Currency and Gateway
        const moneyFlow = await Payment.aggregate([
            { $match: { status: 'success', ...dateFilter } },
            {
                $group: {
                    _id: { currency: '$currency', gateway: '$gateway' },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    currency: '$_id.currency',
                    gateway: '$_id.gateway',
                    totalAmount: 1,
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // 2. Daily Revenue Trend (Last 30 days or filtered range)
        const dailyTrend = await Payment.aggregate([
            { $match: { status: 'success', ...dateFilter } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);

        // 3. Application Status Overview
        const applicationStats = await VisaApplication.aggregate([
            { $match: { isDeleted: false, ...dateFilter } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Payment Method Popularity
        const paymentMethods = await Payment.aggregate([
            { $match: { status: 'success', ...dateFilter } },
            {
                $group: {
                    _id: '$gateway',
                    count: { $sum: 1 },
                    revenue: { $sum: '$amount' }
                }
            }
        ]);

        // 5. Revenue by Source (Agent vs Direct)
        const revenueBySource = await Payment.aggregate([
            { $match: { status: 'success', ...dateFilter } },
            {
                $group: {
                    _id: { $cond: [{ $ifNull: ['$agentId', false] }, 'agent', 'direct'] },
                    count: { $sum: 1 },
                    revenue: { $sum: '$amount' }
                }
            }
        ]);

        // 6. Visa Type Distribution (Which types are most popular)
        const visaTypeStats = await VisaApplication.aggregate([
            { $match: { isDeleted: false, ...dateFilter } },
            {
                $lookup: {
                    from: 'visatypes',
                    localField: 'visaTypeId',
                    foreignField: '_id',
                    as: 'visaType'
                }
            },
            { $unwind: '$visaType' },
            {
                $group: {
                    _id: '$visaType.name',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        return {
            moneyFlow,
            dailyTrend,
            applicationStats,
            paymentMethods,
            revenueBySource,
            visaTypeStats
        };
    }
};
