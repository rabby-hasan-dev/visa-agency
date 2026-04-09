import { Schema, model } from 'mongoose';
import { TUserPassword } from './userPassword.interface';

const userPasswordSchema = new Schema<TUserPassword>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const UserPassword = model<TUserPassword>(
    'UserPassword',
    userPasswordSchema,
);
