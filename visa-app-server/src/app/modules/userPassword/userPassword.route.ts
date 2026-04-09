import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { UserPasswordController } from './userPassword.controller';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    UserPasswordController.getAllUserPasswords,
);

export const UserPasswordRoutes = router;
