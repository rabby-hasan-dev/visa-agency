import { Schema, model } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>({
    applicationId: {
        type: Schema.Types.ObjectId,
        ref: 'VisaApplication',
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'cancelled'],
        default: 'pending'
    },
    gateway: {
        type: String,
        enum: ['stripe', 'sslcommerz'],
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    paymentResponse: {
        type: Schema.Types.Mixed
    },
}, {
    timestamps: true
});

export const Payment = model<TPayment>('Payment', paymentSchema);
