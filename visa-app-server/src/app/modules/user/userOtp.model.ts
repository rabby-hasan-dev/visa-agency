import { Schema, model } from 'mongoose';

const userOTPSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
        },
        otp: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['EMAIL_CHANGE', 'FORGOT_PASSWORD'],
            required: true,
        },
        newEmail: {
            type: String,
        },
        expiresAt: {
            type: Date,
            required: true,
            expires: 0, // This will auto-delete the document after the time is reached
        },
    },
    {
        timestamps: true,
    }
);

export const UserOTP = model('UserOTP', userOTPSchema);
