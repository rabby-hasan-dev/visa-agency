import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { QuestionControllers } from './question.controller';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionValidation } from './question.validation';

const router = express.Router();

// ─── Public Auth: anyone logged-in can READ ────────────────────────────────────

router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    QuestionControllers.getAllQuestions,
);

// Steps config for an entire visa type (used by application form)
router.get(
    '/steps-config/:visaTypeId',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    QuestionControllers.getStepsConfig,
);

router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.agent,
        USER_ROLE.applicant,
    ),
    QuestionControllers.getSingleQuestion,
);

// ─── Super Admin Only: WRITE operations ───────────────────────────────────────

router.post(
    '/',
    auth(USER_ROLE.superAdmin),
    validateRequest(QuestionValidation.createQuestionSchema),
    QuestionControllers.createQuestion,
);

router.patch(
    '/reorder',
    auth(USER_ROLE.superAdmin),
    validateRequest(QuestionValidation.reorderQuestionsSchema),
    QuestionControllers.reorderQuestions,
);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin),
    validateRequest(QuestionValidation.updateQuestionSchema),
    QuestionControllers.updateQuestion,
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin),
    QuestionControllers.deleteQuestion,
);

export const QuestionRoutes = router;
