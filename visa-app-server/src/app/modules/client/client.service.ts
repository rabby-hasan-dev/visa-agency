import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TClient } from './client.interface';
import { Client } from './client.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createClient = async (payload: TClient) => {
    const isClientExists = await Client.findOne({
        passportNumber: payload.passportNumber,
    });

    if (isClientExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Client already exists!');
    }

    const result = await Client.create(payload);
    return result;
};

const getAllClients = async (query: Record<string, unknown>) => {
    const clientQuery = new QueryBuilder(Client.find(), query)
        .search(['fullName', 'passportNumber', 'email'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await clientQuery.countTotal();
    const result = await clientQuery.modelQuery;

    return {
        meta,
        result,
    };
};

const getSingleClient = async (id: string) => {
    const result = await Client.findById(id);
    return result;
};

const updateClient = async (id: string, payload: Partial<TClient>) => {
    const isClientExists = await Client.findById(id);

    if (!isClientExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Client not found!');
    }

    const result = await Client.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

const deleteClient = async (id: string) => {
    const isClientExists = await Client.findById(id);

    if (!isClientExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Client not found!');
    }

    const result = await Client.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const ClientServices = {
    createClient,
    getAllClients,
    getSingleClient,
    updateClient,
    deleteClient,
};
