import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { uploadImages } from '../../config/upload';



const router = express.Router();

router.get(
    '/get-me',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.applicant),
    UserControllers.getMe,
);

router.patch(
    '/update-my-profile',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.applicant),
    uploadImages.single('profileImg'),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserControllers.updateMyProfile,
);

router.post(
    '/create-agent',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(UserValidation.createUserValidationSchema),
    UserControllers.createAgent,
);

router.get('/agents', auth(USER_ROLE.superAdmin, USER_ROLE.admin), UserControllers.getAgents);

router.patch(
    '/update/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    uploadImages.single('profileImg'),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserControllers.updateUser,
);

router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), UserControllers.getUserById);

export const UserRoutes = router;
