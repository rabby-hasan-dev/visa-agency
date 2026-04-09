import { Types } from 'mongoose';

export type TStageHistory = {
    applicationId: Types.ObjectId;
    fromStatus: string;
    toStatus: string;
    changedBy: Types.ObjectId;
    comment?: string;
};
