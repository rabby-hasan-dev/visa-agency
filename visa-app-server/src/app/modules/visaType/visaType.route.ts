import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { VisaTypeControllers } from './visaType.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VisaTypeValidation } from './visaType.validation';


const router = express.Router();

// ─── Public / Auth ─────────────────────────────────────────────────────────────

// Anyone logged-in can read visa types (application form needs this)
router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    VisaTypeControllers.getAllVisaTypes,
);

router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    VisaTypeControllers.getSingleVisaType,
);

// ─── Super Admin Only ──────────────────────────────────────────────────────────

router.post(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(VisaTypeValidation.createVisaTypeSchema),
    VisaTypeControllers.createVisaType,
);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(VisaTypeValidation.updateVisaTypeSchema),
    VisaTypeControllers.updateVisaType,
);

router.patch(
    '/:id/toggle-active',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    VisaTypeControllers.toggleVisaTypeActive,
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    VisaTypeControllers.deleteVisaType,
);

export const VisaTypeRoutes = router;
