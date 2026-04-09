/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import config from '../../../config';
import { IPaymentGatewayService, IPaymentInitiateParams } from '../payment.interface';

interface StripeOverrides {
    secretKey?: string;
}

export class StripePaymentService implements IPaymentGatewayService {
    private stripe: Stripe;

    constructor(overrides?: StripeOverrides) {
        const secretKey = overrides?.secretKey || config.stripe_secret_key;

        if (!secretKey) {
            throw new Error('Stripe API key is missing. Configure it via the Payment Gateway settings or STRIPE_SECRET_KEY env var.');
        }

        this.stripe = new Stripe(secretKey, {
            apiVersion: '2022-11-15' as any,
        });
    }

    async initiatePayment(params: IPaymentInitiateParams): Promise<{ paymentUrl: string | null; transactionId: string; gatewayResponse: any }> {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: params.currency.toLowerCase(),
                        product_data: {
                            name: `Application ${params.applicationId} Payment`,
                        },
                        unit_amount: params.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            client_reference_id: params.transactionId,
            customer_email: params.clientEmail,
        });

        return {
            paymentUrl: session.url,
            transactionId: params.transactionId,
            gatewayResponse: session,
        };
    }

    async verifyPayment(transactionId: string, gatewayResponse: any): Promise<boolean> {
        if (gatewayResponse && gatewayResponse.id) {
            const session = await this.stripe.checkout.sessions.retrieve(gatewayResponse.id);
            return session.payment_status === 'paid';
        }
        return false;
    }
}
