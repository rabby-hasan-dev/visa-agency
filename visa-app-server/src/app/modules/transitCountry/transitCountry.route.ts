import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { TransitCountryControllers } from './transitCountry.controller';
import validateRequest from '../../middlewares/validateRequest';
import { TransitCountryValidation } from './transitCountry.validation';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC / AUTHENTICATED READS
// ─────────────────────────────────────────────────────────────────────────────

// GET /transit-countries/active – returns only isActive=true countries
// Used by the visa application form to build the transit dropdown
router.get(
    '/active',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    TransitCountryControllers.getActiveTransitCountries,
);

// GET /transit-countries – full list (admin can filter/search)
router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    TransitCountryControllers.getAllTransitCountries,
);

// GET /transit-countries/:id
router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    TransitCountryControllers.getSingleTransitCountry,
);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / SUPER-ADMIN MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

// POST /transit-countries
router.post(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(TransitCountryValidation.createTransitCountrySchema),
    TransitCountryControllers.createTransitCountry,
);

// PATCH /transit-countries/bulk-toggle  – enable/disable multiple countries at once
router.patch(
    '/bulk-toggle',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    TransitCountryControllers.bulkToggleTransitCountriesActive,
);

// PATCH /transit-countries/:id
router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(TransitCountryValidation.updateTransitCountrySchema),
    TransitCountryControllers.updateTransitCountry,
);

// PATCH /transit-countries/:id/toggle-active
router.patch(
    '/:id/toggle-active',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    TransitCountryControllers.toggleTransitCountryActive,
);

// DELETE /transit-countries/:id
router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    TransitCountryControllers.deleteTransitCountry,
);

export const TransitCountryRoutes = router;
