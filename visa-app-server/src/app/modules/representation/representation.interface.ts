import { Types } from 'mongoose';

export type TRepresentation = {
    agentId: Types.ObjectId;
    applicantId: Types.ObjectId;
    status: 'pending' | 'authorized' | 'revoked';
    authorizedAt?: Date;
};
