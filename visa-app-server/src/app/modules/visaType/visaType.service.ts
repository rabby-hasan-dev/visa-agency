import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { VisaType } from './visaType.model';
import { TVisaType } from './visaType.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { QuestionServices } from '../question/question.service';

// ─── Create ────────────────────────────────────────────────────────────────────

const createVisaTypeIntoDB = async (payload: TVisaType) => {
    const existing = await VisaType.findOne({ name: payload.name });
    if (existing) {
        throw new AppError(httpStatus.CONFLICT, 'A visa type with this name already exists');
    }

    const result = await VisaType.create(payload);
    return result;
};

// ─── Read All ──────────────────────────────────────────────────────────────────

const getAllVisaTypesFromDB = async (query: Record<string, unknown>) => {
    const visaTypeQuery = new QueryBuilder(
        VisaType.find(),
        query,
    )
        .search(['name', 'category', 'code', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await visaTypeQuery.countTotal();
    const result = await visaTypeQuery.modelQuery;

    return { meta, result };
};

// ─── Read One ──────────────────────────────────────────────────────────────────

const getSingleVisaTypeFromDB = async (id: string) => {
    const result = await VisaType.findById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Visa type not found');
    }
    return result;
};

// ─── Update ────────────────────────────────────────────────────────────────────

const updateVisaTypeIntoDB = async (
    id: string,
    payload: Partial<TVisaType>,
) => {
    const existing = await VisaType.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Visa type not found');
    }

    // Prevent duplicate name (if name is being changed)
    if (payload.name && payload.name !== existing.name) {
        const duplicate = await VisaType.findOne({ name: payload.name });
        if (duplicate) {
            throw new AppError(
                httpStatus.CONFLICT,
                'Another visa type with this name already exists',
            );
        }
    }

    const result = await VisaType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

// ─── Soft Delete ───────────────────────────────────────────────────────────────

const deleteVisaTypeFromDB = async (id: string) => {
    const existing = await VisaType.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Visa type not found');
    }

    // Cascade: soft-delete all questions belonging to this visa type
    await QuestionServices.deleteQuestionsByVisaTypeId(id);

    const result = await VisaType.findByIdAndUpdate(
        id,
        { isDeleted: true, isActive: false },
        { new: true },
    );

    return result;
};

// ─── Toggle Active ─────────────────────────────────────────────────────────────

const toggleVisaTypeActiveStatus = async (id: string) => {
    const existing = await VisaType.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Visa type not found');
    }

    const result = await VisaType.findByIdAndUpdate(
        id,
        { isActive: !existing.isActive },
        { new: true },
    );

    return result;
};

export const VisaTypeServices = {
    createVisaTypeIntoDB,
    getAllVisaTypesFromDB,
    getSingleVisaTypeFromDB,
    updateVisaTypeIntoDB,
    deleteVisaTypeFromDB,
    toggleVisaTypeActiveStatus,
};
