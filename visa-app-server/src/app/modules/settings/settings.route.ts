import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { SettingsControllers } from './settings.controller';

const router = express.Router();

// Publicly readable site settings (logos, brand names)
router.get('/site', SettingsControllers.getSiteSettings);
router.get('/navigation', SettingsControllers.getNavigation);
router.get('/global-options', SettingsControllers.getGlobalOptions);

// Admin only update routes
router.patch(
    '/site',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    SettingsControllers.updateSiteSettings
);

router.patch(
    '/navigation',
    auth(USER_ROLE.superAdmin),
    SettingsControllers.updateNavigation
);

router.patch(
    '/global-options',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    SettingsControllers.updateGlobalOptions
);

// Super Admin only — configurations
router.get(
    '/payment-config',
    auth(USER_ROLE.superAdmin),
    SettingsControllers.getPaymentConfig
);

router.patch(
    '/payment-config',
    auth(USER_ROLE.superAdmin),
    SettingsControllers.updatePaymentConfig
);

router.get(
    '/cloudinary-config',
    auth(USER_ROLE.superAdmin),
    SettingsControllers.getCloudinaryConfig
);

router.patch(
    '/cloudinary-config',
    auth(USER_ROLE.superAdmin),
    SettingsControllers.updateCloudinaryConfig
);

router.get(
    '/app-config',
    auth(USER_ROLE.superAdmin),
    SettingsControllers.getAppConfig
);

router.patch(
    '/app-config',
    auth(USER_ROLE.superAdmin),
    SettingsControllers.updateAppConfig
);

export const SettingsRoutes = router;
