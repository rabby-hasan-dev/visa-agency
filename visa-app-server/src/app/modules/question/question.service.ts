import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Question } from './question.model';
import { TQuestion } from './question.interface';
import { VisaType } from '../visaType/visaType.model';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Verify the visaTypeId actually exists */
const assertVisaTypeExists = async (visaTypeId: string) => {
    const visaType = await VisaType.findById(visaTypeId);
    if (!visaType) {
        throw new AppError(httpStatus.NOT_FOUND, 'Visa type not found');
    }
};

// ─── Create ────────────────────────────────────────────────────────────────────

const createQuestionIntoDB = async (payload: TQuestion) => {
    await assertVisaTypeExists(String(payload.visaTypeId));

    // Prevent duplicate fieldKey within the same step of the same visa type
    const duplicate = await Question.findOne({
        visaTypeId: payload.visaTypeId,
        stepNumber: payload.stepNumber,
        fieldKey: payload.fieldKey,
    });

    if (duplicate) {
        throw new AppError(
            httpStatus.CONFLICT,
            `A question with fieldKey "${payload.fieldKey}" already exists in step ${payload.stepNumber} of this visa type`,
        );
    }

    const result = await Question.create(payload);
    return result;
};

// ─── Read All (with optional filters) ─────────────────────────────────────────

const getAllQuestionsFromDB = async (query: Record<string, unknown>) => {
    const filter: Record<string, unknown> = {};

    if (query.visaTypeId) {
        filter.visaTypeId = query.visaTypeId;
    }
    if (query.stepNumber) {
        filter.stepNumber = Number(query.stepNumber);
    }

    const result = await Question.find(filter)
        .populate('visaTypeId', 'name code category')
        .sort({ stepNumber: 1, sortOrder: 1 });

    return result;
};

// ─── Get Steps Config for a Visa Type ─────────────────────────────────────────
/**
 * Returns a structured config identical to old VISA_CONFIGS format so
 * the client can render steps without code changes.
 *
 * Shape:
 * {
 *   totalSteps: 10,
 *   sidebarLinks: [...],
 *   steps: {
 *     1: { label: "Terms & Conditions", questions: [...] },
 *     2: { label: "Applicant Details",  questions: [...] },
 *   }
 * }
 */
const getStepsConfigForVisaType = async (visaTypeId: string) => {
    const visaType = await VisaType.findById(visaTypeId);
    if (!visaType) {
        throw new AppError(httpStatus.NOT_FOUND, 'Visa type not found');
    }

    const questions = await Question.find({ visaTypeId }).sort({
        stepNumber: 1,
        sortOrder: 1,
    });

    // Group by stepNumber
    const stepsMap: Record<
        number,
        { label: string; questions: typeof questions }
    > = {};

    for (const q of questions) {
        if (!stepsMap[q.stepNumber]) {
            stepsMap[q.stepNumber] = {
                label: q.stepLabel,
                questions: [],
            };
        }
        stepsMap[q.stepNumber].questions.push(q);
    }

    return {
        totalSteps: visaType.totalSteps,
        sidebarLinks: visaType.sidebarLinks || [],
        steps: stepsMap,
    };
};

// ─── Read One ──────────────────────────────────────────────────────────────────

const getSingleQuestionFromDB = async (id: string) => {
    const result = await Question.findById(id).populate(
        'visaTypeId',
        'name code category',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }
    return result;
};

// ─── Update ────────────────────────────────────────────────────────────────────

const updateQuestionIntoDB = async (
    id: string,
    payload: Partial<TQuestion>,
) => {
    const existing = await Question.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }

    // If fieldKey / stepNumber is changing, check for duplicates
    const targetFieldKey = payload.fieldKey ?? existing.fieldKey;
    const targetStepNumber = payload.stepNumber ?? existing.stepNumber;
    const targetVisaTypeId = payload.visaTypeId ?? existing.visaTypeId;

    const isKeyChanging =
        targetFieldKey !== existing.fieldKey ||
        targetStepNumber !== existing.stepNumber;

    if (isKeyChanging) {
        const duplicate = await Question.findOne({
            visaTypeId: targetVisaTypeId,
            stepNumber: targetStepNumber,
            fieldKey: targetFieldKey,
            _id: { $ne: id },
        });
        if (duplicate) {
            throw new AppError(
                httpStatus.CONFLICT,
                `A question with fieldKey "${targetFieldKey}" already exists in step ${targetStepNumber}`,
            );
        }
    }

    const result = await Question.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

// ─── Soft Delete ───────────────────────────────────────────────────────────────

const deleteQuestionFromDB = async (id: string) => {
    const existing = await Question.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }

    const result = await Question.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );

    return result;
};

// ─── Bulk Reorder ──────────────────────────────────────────────────────────────
/**
 * Accepts an array of { id, sortOrder } and updates each question's sortOrder.
 * Used by the drag-to-reorder UI in the super admin panel.
 */
const reorderQuestionsIntoDB = async (
    items: { id: string; sortOrder: number }[],
) => {
    const ops = items.map((item) => ({
        updateOne: {
            filter: { _id: item.id },
            update: { $set: { sortOrder: item.sortOrder } },
        },
    }));

    await Question.bulkWrite(ops);
    return { updated: items.length };
};

// ─── Delete All by VisaType ────────────────────────────────────────────────────
/** Used when a visa type is deleted — cascade soft-delete its questions */
const deleteQuestionsByVisaTypeId = async (visaTypeId: string) => {
    await Question.updateMany({ visaTypeId }, { isDeleted: true });
};

export const QuestionServices = {
    createQuestionIntoDB,
    getAllQuestionsFromDB,
    getStepsConfigForVisaType,
    getSingleQuestionFromDB,
    updateQuestionIntoDB,
    deleteQuestionFromDB,
    reorderQuestionsIntoDB,
    deleteQuestionsByVisaTypeId,
};
