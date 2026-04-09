import { Schema, model } from 'mongoose';
import { TPaymentLog } from './paymentLog.interface';

const paymentLogSchema = new Schema<TPaymentLog>(
    {
        paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
        transactionId: { type: String, required: true },
        action: {
            type: String,
            enum: ['INITIATED', 'WEBHOOK_RECEIVED', 'VERIFIED', 'FAILED', 'CANCELLED'],
            required: true
        },
        gateway: { type: String, required: true },
        payload: { type: Schema.Types.Mixed },
        error: { type: Schema.Types.Mixed }
    },
    {
        timestamps: true,
    }
);

export const PaymentLog = model<TPaymentLog>('PaymentLog', paymentLogSchema);
