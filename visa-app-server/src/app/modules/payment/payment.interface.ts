/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface IPaymentInitiateParams {
    amount: number;
    currency: string;
    transactionId: string;
    clientName: string;
    clientEmail: string;
    applicationId: string;
    successUrl: string;
    failUrl: string;
    cancelUrl: string;
    ipnUrl?: string;
    logoUrl?: string;
    storeName?: string;
    themeColor?: string;
}

export interface IPaymentGatewayService {
    initiatePayment(_params: IPaymentInitiateParams): Promise<{ paymentUrl: string | null; transactionId: string; gatewayResponse: any }>;
    verifyPayment(_transactionId: string, _gatewayResponse: any): Promise<boolean>;
}

export type TPaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';
export type TPaymentGateway = 'stripe' | 'sslcommerz';

export interface TPayment {
    applicationId: Types.ObjectId;
    clientId: Types.ObjectId;
    agentId?: Types.ObjectId;
    amount: number;
    currency: string;
    status: TPaymentStatus;
    gateway: TPaymentGateway;
    transactionId: string;
    paymentResponse?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
