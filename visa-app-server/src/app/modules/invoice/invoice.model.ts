import { Schema, model } from 'mongoose';
import { TInvoice } from './invoice.interface';

const invoiceSchema = new Schema<TInvoice>(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: 'VisaApplication',
            required: true,
        },
        agentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        clientId: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'AUD',
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
        },
        paidAt: {
            type: Date,
        },
        description: {
            type: String,
            default: 'Visa Application Fee',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Invoice = model<TInvoice>('Invoice', invoiceSchema);
