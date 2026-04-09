import express from 'express';
import { InvoiceControllers } from './invoice.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.agent, USER_ROLE.admin),
    InvoiceControllers.createInvoice, // Add zod validation here ideally
);

router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.agent),
    InvoiceControllers.getAllInvoices,
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.agent),
    InvoiceControllers.getSingleInvoice,
);

router.post(
    '/:id/pay',
    auth(USER_ROLE.agent, USER_ROLE.admin),
    InvoiceControllers.payInvoice,
);

export const InvoiceRoutes = router;
