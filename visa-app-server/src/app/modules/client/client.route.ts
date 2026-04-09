import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ClientControllers } from './client.controller';
import { ClientValidation } from './client.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.agent),
    validateRequest(ClientValidation.createClientValidationSchema),
    ClientControllers.createClient,
);

router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.agent),
    ClientControllers.getAllClients,
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.agent),
    ClientControllers.getSingleClient,
);

router.patch(
    '/:id',
    auth(USER_ROLE.agent),
    validateRequest(ClientValidation.updateClientValidationSchema),
    ClientControllers.updateClient,
);

router.delete('/:id', auth(USER_ROLE.admin), ClientControllers.deleteClient);

export const ClientRoutes = router;
