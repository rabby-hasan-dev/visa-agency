/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface TPaymentLog {
    paymentId?: Types.ObjectId;
    transactionId: string;
    action: 'INITIATED' | 'WEBHOOK_RECEIVED' | 'VERIFIED' | 'FAILED' | 'CANCELLED';
    gateway: string;
    payload?: any;
    error?: any;
    createdAt?: Date;
}
