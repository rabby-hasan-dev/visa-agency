import { TPaymentGateway, IPaymentGatewayService } from './payment.interface';
import { SslCommerzPaymentService } from './gateways/sslcommerz.service';
import { StripePaymentService } from './gateways/stripe.service';
import { SettingsServices } from '../settings/settings.service';

export const PaymentGatewayFactory = {
    async getService(gateway: TPaymentGateway): Promise<IPaymentGatewayService> {
        // Load decrypted credentials from DB (falls back to defaults/env if nothing saved)
        const config = await SettingsServices.getDecryptedPaymentConfig();

        switch (gateway) {
            case 'stripe': {
                const stripe = config.stripe;
                const secretKey = stripe.mode === 'live'
                    ? (stripe.liveSecretKey || undefined)
                    : (stripe.testSecretKey || undefined);
                return new StripePaymentService(secretKey ? { secretKey } : undefined);
            }
            case 'sslcommerz': {
                const ssl = config.sslcommerz;
                const isLive = ssl.mode === 'live';
                const storeId = isLive ? (ssl.liveStoreId || undefined) : (ssl.testStoreId || undefined);
                const storePasswd = isLive ? (ssl.liveStorePassword || undefined) : (ssl.testStorePassword || undefined);
                return new SslCommerzPaymentService(
                    (storeId && storePasswd) ? { storeId, storePasswd, isLive } : undefined
                );
            }
            default:
                throw new Error(`Unsupported payment gateway: ${gateway}`);
        }
    }
};
