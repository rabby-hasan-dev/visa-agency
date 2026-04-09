import { Types } from 'mongoose';

export type TApplicantProfile = {
    userId: Types.ObjectId;
    passportNumber: string;
    nationality: string;
    dateOfBirth: Date;
    address: {
        street: string;
        address2?: string;
        city: string;
        state?: string;
        country: string;
        zipCode: string;
    };
};
