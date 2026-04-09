import { Types } from 'mongoose';

export type TClient = {
    agentId: Types.ObjectId;
    fullName: string;
    passportNumber: string;
    dateOfBirth: string;
    nationality: string;
    email: string;
    phone: string;
    isDeleted: boolean;
};
