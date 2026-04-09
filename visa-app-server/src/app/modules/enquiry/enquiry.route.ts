import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { EnquiryController } from './enquiry.controller';

const router = express.Router();

router.post('/', EnquiryController.createEnquiry);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  EnquiryController.getAllEnquiries,
);

router.patch(
  '/:id/status',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  EnquiryController.updateEnquiryStatus,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  EnquiryController.deleteEnquiry,
);

export const EnquiryRoutes = router;
