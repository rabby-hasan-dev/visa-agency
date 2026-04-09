import express from 'express';
import { MessageControllers } from './message.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.agent),
    MessageControllers.addMessage,
);

router.get(
    '/:applicationId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.agent),
    MessageControllers.getApplicationMessages,
);

router.patch(
    '/:applicationId/read',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.agent),
    MessageControllers.markMessagesAsRead,
);

export const MessageRoutes = router;
