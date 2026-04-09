/* eslint-disable @typescript-eslint/no-explicit-any */
import SSLCommerzPayment from 'sslcommerz-lts';
import { IPaymentGatewayService, IPaymentInitiateParams } from '../payment.interface';
import config from '../../../config';

interface SslCommerzOverrides {
    storeId?: string;
    storePasswd?: string;
    isLive?: boolean;
}

export class SslCommerzPaymentService implements IPaymentGatewayService {
    private sslcommerz: SSLCommerzPayment;
    private isLive: boolean;

    constructor(overrides?: SslCommerzOverrides) {
        const storeId = overrides?.storeId || config.sslcommerz_store_id;
        const storePasswd = overrides?.storePasswd || config.sslcommerz_store_passwd;

        if (!storeId || !storePasswd) {
            throw new Error('SSLCommerz Store ID or Password is missing.');
        }

        // Priority: DB overrides → env var
        this.isLive = overrides?.isLive !== undefined
            ? overrides.isLive
            : (config.sslcommerz_is_live as any === true || config.sslcommerz_is_live as any === 'true');

        this.sslcommerz = new SSLCommerzPayment(storeId, storePasswd, this.isLive);
    }

    async initiatePayment(params: IPaymentInitiateParams): Promise<{ paymentUrl: string | null; transactionId: string; gatewayResponse: any }> {
        if (!params.amount || Number(params.amount) <= 0) {
            throw new Error('SSLCommerz requires a positive amount greater than 0.');
        }

        const ensureProtocol = (url: string) => (url?.startsWith('http') ? url : `http://${url}`);

        const data = {
            total_amount: Number(params.amount),
            currency: params.currency || 'BDT',
            tran_id: (params.transactionId || `TXN-${Date.now()}`).toString(),
            success_url: ensureProtocol(params.successUrl),
            fail_url: ensureProtocol(params.failUrl),
            cancel_url: ensureProtocol(params.cancelUrl),
            ipn_url: ensureProtocol(params.ipnUrl || params.successUrl),
            shipping_method: 'NO',
            product_name: 'Visa Service',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: (params.clientName || 'Customer').substring(0, 30),
            cus_email: params.clientEmail || 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01700000000',
            multi_card_name: 'cards,internetbank',
            store_name: params.storeName || 'Visa Application',
            store_logo: params.logoUrl || '',
            value_a: params.logoUrl || '',
            value_b: params.storeName || '',
            value_c: params.themeColor || '',
        };

        const response = await this.sslcommerz.init(data);

        if (!response?.GatewayPageURL) {
            const errorMsg = response?.failedreason || response?.status || 'Unknown failure';
            throw new Error(`SSLCommerz Initiation Failed: ${errorMsg}`);
        }

        return {
            paymentUrl: response.GatewayPageURL,
            transactionId: params.transactionId,
            gatewayResponse: response,
        };
    }

    async verifyPayment(transactionId: string, gatewayResponse: any): Promise<boolean> {
        // Use val_id if provided (more secure than just status)
        if (gatewayResponse?.val_id) {
            try {
                const validationResult = await this.sslcommerz.validate({ val_id: gatewayResponse.val_id });
                return validationResult?.status === 'VALID' || validationResult?.status === 'VALIDATED';
            } catch (error) {
                console.error('SSLCommerz Validation Error:', error);
                return false;
            }
        }
        return gatewayResponse?.status === 'VALID' || gatewayResponse?.status === 'VALIDATED';
    }
}
