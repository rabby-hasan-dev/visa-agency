import express from 'express';
import { AdminControllers } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
    '/stats',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    AdminControllers.getDashboardStats,
);

router.get(
    '/agent-performance',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    AdminControllers.getAgentPerformance,
);

router.get(
    '/admins',
    auth(USER_ROLE.superAdmin),
    AdminControllers.getAllAdmins,
);

router.patch(
    '/admins/:id/status',
    auth(USER_ROLE.superAdmin),
    AdminControllers.updateAdminStatus,
);

router.delete(
    '/admins/:id',
    auth(USER_ROLE.superAdmin),
    AdminControllers.deleteAdmin,
);

export const AdminRoutes = router;
