import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Invoice } from './invoice.model';
import { VisaApplication } from '../visaApplication/visaApplication.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { VISA_APPLICATION_STATUS } from '../visaApplication/visaApplication.constant';

// ─── Internal: auto-create invoice right after submission (idempotent) ────────
const createInvoiceForApplication = async (applicationId: string) => {
    const application = await VisaApplication.findById(applicationId);
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    // Idempotency guard — never create duplicate invoices
    const existing = await Invoice.findOne({ applicationId, isDeleted: false });
    if (existing) return existing;

    const finalAmount = application.totalAmount || 0;
    const currency = (application as unknown as { currency?: string }).currency || 'AUD';

    if (!application.clientId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Application has no linked client. Cannot create invoice.');
    }

    // Generate Invoice Number: INV-YYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

    const invoice = await Invoice.create({
        invoiceNumber,
        applicationId,
        agentId: application.createdByAgentId || undefined,
        clientId: application.clientId,
        amount: finalAmount,
        currency,
        description: `Visa Application Fee — ${application.visaCategory || 'Visa Application'}`,
        status: 'pending',
    });

    return invoice;
};

// ─── Agent-led: create invoice manually with agent authorization check ────────
const createInvoice = async (
    agentId: string,
    applicationId: string,
    amount?: number,
    description?: string,
) => {
    const application = await VisaApplication.findOne({ _id: applicationId, createdByAgentId: agentId });
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found or unauthorized');
    }

    const finalAmount = amount || application.totalAmount || 0;

    if (!application.clientId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Application is not attached to a client yet');
    }

    // Generate Invoice Number INV-YYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

    const invoice = await Invoice.create({
        invoiceNumber,
        applicationId,
        agentId,
        clientId: application.clientId,
        amount: finalAmount,
        description: description || 'Visa Application Fee',
        status: 'pending',
    });

    return invoice;
};

import { invoiceSearchableFields } from './invoice.constant';

const getAllInvoices = async (
    query: Record<string, unknown>,
    agentId?: string,
) => {
    const filter: Record<string, unknown> = { isDeleted: false };
    if (agentId) {
        filter.agentId = agentId;
    }

    const invoiceQuery = new QueryBuilder(
        Invoice.find(filter).populate('applicationId').populate('agentId', 'name email').populate('clientId', 'name passportNumber'),
        query,
    )
        .search(invoiceSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await invoiceQuery.countTotal();
    const result = await invoiceQuery.modelQuery;

    return {
        meta,
        result,
    };
};

const getSingleInvoice = async (id: string, agentId?: string) => {
    const query: Record<string, unknown> = { _id: id, isDeleted: false };
    if (agentId) {
        query.agentId = agentId;
    }

    const result = await Invoice.findOne(query)
        .populate('applicationId')
        .populate('clientId');

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
    }
    return result;
};

const payInvoice = async (id: string, agentId: string, paymentMethod: string) => {
    const invoice = await Invoice.findOne({ _id: id, agentId, isDeleted: false });
    if (!invoice) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invoice not found');
    }

    if (invoice.status === 'paid') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invoice is already paid');
    }

    // Update invoice
    invoice.status = 'paid';
    invoice.paidAt = new Date();
    invoice.paymentMethod = paymentMethod || 'Online Gateway';
    await invoice.save();

    // Update Application status to paid
    await VisaApplication.findByIdAndUpdate(invoice.applicationId, {
        status: VISA_APPLICATION_STATUS.PAID,
    });

    return invoice;
};

export const InvoiceServices = {
    createInvoiceForApplication,
    createInvoice,
    getAllInvoices,
    getSingleInvoice,
    payInvoice,
};
