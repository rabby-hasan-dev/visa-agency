import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TransitCountry } from './transitCountry.model';
import { TTransitCountry } from './transitCountry.interface';
import QueryBuilder from '../../builder/QueryBuilder';

// ─── Create ────────────────────────────────────────────────────────────────────

const createTransitCountryIntoDB = async (payload: TTransitCountry) => {
    const existing = await TransitCountry.findOne({ name: payload.name });
    if (existing) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A transit country with this name already exists',
        );
    }

    const result = await TransitCountry.create(payload);
    return result;
};

// ─── Read All ──────────────────────────────────────────────────────────────────

const getAllTransitCountriesFromDB = async (query: Record<string, unknown>) => {
    const countryQuery = new QueryBuilder(TransitCountry.find(), query)
        .search(['name', 'code'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await countryQuery.countTotal();
    const result = await countryQuery.modelQuery;

    return { meta, result };
};

// ─── Read Active Only (public-facing use) ──────────────────────────────────────

const getActiveTransitCountriesFromDB = async () => {
    const result = await TransitCountry.find({ isActive: true }).sort({
        sortOrder: 1,
        name: 1,
    });
    return result;
};

// ─── Read One ──────────────────────────────────────────────────────────────────

const getSingleTransitCountryFromDB = async (id: string) => {
    const result = await TransitCountry.findById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Transit country not found');
    }
    return result;
};

// ─── Update ────────────────────────────────────────────────────────────────────

const updateTransitCountryIntoDB = async (
    id: string,
    payload: Partial<TTransitCountry>,
) => {
    const existing = await TransitCountry.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Transit country not found');
    }

    // Prevent duplicate name
    if (payload.name && payload.name !== existing.name) {
        const duplicate = await TransitCountry.findOne({ name: payload.name });
        if (duplicate) {
            throw new AppError(
                httpStatus.CONFLICT,
                'Another transit country with this name already exists',
            );
        }
    }

    const result = await TransitCountry.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

// ─── Soft Delete ───────────────────────────────────────────────────────────────

const deleteTransitCountryFromDB = async (id: string) => {
    const existing = await TransitCountry.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Transit country not found');
    }

    const result = await TransitCountry.findByIdAndUpdate(
        id,
        { isDeleted: true, isActive: false },
        { new: true },
    );

    return result;
};

// ─── Toggle Active ─────────────────────────────────────────────────────────────

const toggleTransitCountryActiveStatus = async (id: string) => {
    const existing = await TransitCountry.findById(id);
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, 'Transit country not found');
    }

    const result = await TransitCountry.findByIdAndUpdate(
        id,
        { isActive: !existing.isActive },
        { new: true },
    );

    return result;
};

// ─── Bulk Toggle (array of IDs) ─────────────────────────────────────────────────

const bulkToggleTransitCountriesStatus = async (
    ids: string[],
    isActive: boolean,
) => {
    const result = await TransitCountry.updateMany(
        { _id: { $in: ids }, isDeleted: { $ne: true } },
        { isActive },
    );
    return result;
};

export const TransitCountryServices = {
    createTransitCountryIntoDB,
    getAllTransitCountriesFromDB,
    getActiveTransitCountriesFromDB,
    getSingleTransitCountryFromDB,
    updateTransitCountryIntoDB,
    deleteTransitCountryFromDB,
    toggleTransitCountryActiveStatus,
    bulkToggleTransitCountriesStatus,
};
