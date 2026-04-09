import express from 'express';
import { PaymentControllers } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Initiate payment — no auth required (called right after anonymous/agent submit)
router.post('/initiate', PaymentControllers.initiatePayment);

// Get payment by transaction ID — public (for success page after redirect)
router.get('/by-transaction/:tx', PaymentControllers.getPaymentByTransaction);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    PaymentControllers.getAllPayments,
);

router.get(
    '/stats',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    PaymentControllers.getPaymentStats,
);

router.get(
    '/accounting-report',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    PaymentControllers.getAccountingReport,
);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    PaymentControllers.getSinglePayment,
);

// Webhook: SSLCommerz POSTs here after payment (also used as success_url for browser redirect)
// No express.raw — we need the urlencoded body parsed (SSLCommerz sends form data)
router.post('/webhook/:gateway', PaymentControllers.handleWebhook);
router.get('/webhook/:gateway', PaymentControllers.handleWebhook);

export const PaymentRoutes = router;
