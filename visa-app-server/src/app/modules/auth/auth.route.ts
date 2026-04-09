import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { UserValidation } from '../user/user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
);

router.post(
    '/register',
    validateRequest(UserValidation.createUserValidationSchema),
    AuthControllers.registerUser,
);

router.post(
    '/change-password',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.applicant),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.post(
    '/request-email-change',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.applicant),
    validateRequest(AuthValidation.requestEmailChangeValidationSchema),
    AuthControllers.requestEmailChange,
);

router.post(
    '/verify-email-change',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.applicant),
    validateRequest(AuthValidation.verifyEmailChangeValidationSchema),
    AuthControllers.verifyEmailChange,
);

router.post(
    '/forgot-password',
    validateRequest(AuthValidation.forgotPasswordValidationSchema),
    AuthControllers.forgotPassword,
);

router.post(
    '/reset-password',
    validateRequest(AuthValidation.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);

export const AuthRoutes = router;
