import { Types } from 'mongoose';

export type TInvoice = {
    invoiceNumber: string;
    applicationId: Types.ObjectId;
    agentId: Types.ObjectId;
    clientId: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'cancelled';
    paymentMethod?: string;
    paidAt?: Date;
    description: string;
    isDeleted: boolean;
};
