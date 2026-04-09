import { Types } from 'mongoose';

export type TAgentProfile = {
    userId: Types.ObjectId;
    licenseNumber: string;
    marn?: string;
    companyName?: string;
    businessAddress?: string;
    title?: string;
    givenNames?: string;
    familyName?: string;
    city?: string;
    stateProvince?: string;
    zipPostalCode?: string;
    country?: string;
    isVerified: boolean;
};
