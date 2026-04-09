import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { VisaApplicationControllers } from './visaApplication.controller';
import { uploadDocuments } from '../../config/upload';



const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.applicant, USER_ROLE.agent),
    VisaApplicationControllers.createVisaApplication
);

router.post(
    '/import',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.agent),
    VisaApplicationControllers.importVisaApplications
);

router.patch(
    '/:id/update-step',
    auth(USER_ROLE.applicant, USER_ROLE.agent),
    VisaApplicationControllers.updateVisaApplicationStep
);

router.post(
    '/:id/submit',
    auth(USER_ROLE.applicant, USER_ROLE.agent),
    VisaApplicationControllers.submitVisaApplication
);

router.post(
    '/:id/update-requests',
    auth(USER_ROLE.applicant, USER_ROLE.agent, USER_ROLE.admin, USER_ROLE.superAdmin),
    VisaApplicationControllers.submitUpdateRequest
);

router.patch(
    '/:id/documents',
    auth(USER_ROLE.applicant, USER_ROLE.agent, USER_ROLE.admin, USER_ROLE.superAdmin),
    uploadDocuments.array('documents'),
    VisaApplicationControllers.addDocuments
);

router.delete(
    '/:id/documents',
    auth(USER_ROLE.applicant, USER_ROLE.agent, USER_ROLE.admin, USER_ROLE.superAdmin),
    VisaApplicationControllers.removeDocument
);

router.patch(
    '/:id/status',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    VisaApplicationControllers.updateVisaApplicationStatus
);

router.post(
    '/:id/admin-requests',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    VisaApplicationControllers.addAdminRequest
);

router.patch(
    '/:id/admin-requests/:requestId/resolve',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.agent, USER_ROLE.applicant),
    VisaApplicationControllers.resolveAdminRequest
);

router.get(
    '/',
    auth(USER_ROLE.applicant, USER_ROLE.agent, USER_ROLE.admin, USER_ROLE.superAdmin),
    VisaApplicationControllers.getAllVisaApplications
);

router.get(
    '/:id',
    auth(USER_ROLE.applicant, USER_ROLE.agent, USER_ROLE.admin, USER_ROLE.superAdmin),
    VisaApplicationControllers.getSingleVisaApplication
);

router.delete(
    '/:id',
    auth(USER_ROLE.applicant, USER_ROLE.agent, USER_ROLE.admin, USER_ROLE.superAdmin),
    VisaApplicationControllers.deleteVisaApplication
);

export const VisaApplicationRoutes = router;
