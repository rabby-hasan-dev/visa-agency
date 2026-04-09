import { Schema, model } from 'mongoose';
import { TClient } from './client.interface';

const clientSchema = new Schema<TClient>(
    {
        agentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        passportNumber: {
            type: String,
            required: true,
            unique: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Client = model<TClient>('Client', clientSchema);
