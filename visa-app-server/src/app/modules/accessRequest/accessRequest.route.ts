import express from 'express';
import auth from '../../middlewares/auth';
import { AccessRequestControllers } from './accessRequest.controller';

const router = express.Router();

router.post(
  '/',
  auth('superAdmin', 'admin', 'agent', 'applicant'),
  AccessRequestControllers.createAccessRequest,
);

router.get(
  '/my-requests',
  auth('superAdmin', 'admin', 'agent', 'applicant'),
  AccessRequestControllers.getMyAccessRequests,
);

router.get(
  '/',
  auth('superAdmin', 'admin'),
  AccessRequestControllers.getAllAccessRequests,
);

router.patch(
  '/:id/status',
  auth('superAdmin', 'admin'),
  AccessRequestControllers.updateAccessRequestStatus,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin', 'agent', 'applicant'),
  AccessRequestControllers.deleteAccessRequest,
);

export const AccessRequestRoutes = router;
