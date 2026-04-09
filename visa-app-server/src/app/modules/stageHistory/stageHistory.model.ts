import { Schema, model } from 'mongoose';
import { TStageHistory } from './stageHistory.interface';

const stageHistorySchema = new Schema<TStageHistory>(
    {
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: 'VisaApplication',
            required: true,
        },
        fromStatus: {
            type: String,
            required: true,
        },
        toStatus: {
            type: String,
            required: true,
        },
        changedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const StageHistory = model<TStageHistory>('StageHistory', stageHistorySchema);
