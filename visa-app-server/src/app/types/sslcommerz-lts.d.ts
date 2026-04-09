declare module 'sslcommerz-lts' {
    interface SSLCommerzSessionData {
        total_amount: number;
        currency: string;
        tran_id: string;
        success_url: string;
        fail_url: string;
        cancel_url: string;
        ipn_url?: string;
        shipping_method: string;
        product_name: string;
        product_category: string;
        product_profile: string;
        cus_name: string;
        cus_email: string;
        cus_add1: string;
        cus_city: string;
        cus_postcode: string;
        cus_country: string;
        cus_phone: string;
        [key: string]: any;
    }

    class SSLCommerzPayment {
        constructor(store_id: string, store_passwd: string, is_live: boolean);
        init(data: SSLCommerzSessionData): Promise<any>;
        validate(data: any): Promise<any>;
        transactionQueryByTransId(tran_id: string): Promise<any>;
        transactionQueryByRefundId(refund_id: string): Promise<any>;
        refund(data: any): Promise<any>;
        refundQuery(refund_id: string): Promise<any>;
    }
    export default SSLCommerzPayment;
}
