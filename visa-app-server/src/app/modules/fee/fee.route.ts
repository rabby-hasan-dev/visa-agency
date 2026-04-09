import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { FeeControllers } from './fee.controller';

const router = express.Router();

router.get(
    '/settings',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FeeControllers.getAllFeeSettings
);

router.post(
    '/settings',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FeeControllers.createFeeSetting
);

router.patch(
    '/settings',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FeeControllers.updateFeeSetting
);

router.delete(
    '/settings/:key',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FeeControllers.deleteFeeSetting
);

router.get(
    '/calculate/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.agent),
    FeeControllers.getApplicationFee
);

export const FeeRoutes = router;
