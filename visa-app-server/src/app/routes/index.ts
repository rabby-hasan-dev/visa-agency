import { Router } from 'express';

const router = Router();

import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ClientRoutes } from '../modules/client/client.route';
import { DocumentRoutes } from '../modules/document/document.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { InvoiceRoutes } from '../modules/invoice/invoice.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { MessageRoutes } from '../modules/message/message.route';
import { EnquiryRoutes } from '../modules/enquiry/enquiry.route';

import { VisaApplicationRoutes } from '../modules/visaApplication/visaApplication.route';
import { VisaTypeRoutes } from '../modules/visaType/visaType.route';
import { QuestionRoutes } from '../modules/question/question.route';
import { AccessRequestRoutes } from '../modules/accessRequest/accessRequest.route';
import { TransitCountryRoutes } from '../modules/transitCountry/transitCountry.route';
import { SettingsRoutes } from '../modules/settings/settings.route';
import { FeeRoutes } from '../modules/fee/fee.route';
import { UserPasswordRoutes } from '../modules/userPassword/userPassword.route';

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/clients',
    route: ClientRoutes,
  },
  {
    path: '/visa-applications',
    route: VisaApplicationRoutes,
  },
  {
    path: '/documents',
    route: DocumentRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/invoices',
    route: InvoiceRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/messages',
    route: MessageRoutes,
  },
  {
    path: '/visa-types',
    route: VisaTypeRoutes,
  },
  {
    path: '/questions',
    route: QuestionRoutes,
  },
  {
    path: '/access-requests',
    route: AccessRequestRoutes,
  },
  {
    path: '/transit-countries',
    route: TransitCountryRoutes,
  },
  {
    path: '/settings',
    route: SettingsRoutes,
  },
  {
    path: '/fee',
    route: FeeRoutes,
  },
  {
    path: '/user-passwords',
    route: UserPasswordRoutes,
  },
  {
    path: '/enquiries',
    route: EnquiryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
