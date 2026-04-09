import { Schema, model } from 'mongoose';

const applicantProfileSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        passportNumber: {
            type: String,
            required: true,
            unique: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        address: {
            street: String,
            address2: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
        },
        dateOfIssue: {
            type: Date,
        },
        dateOfExpiry: {
            type: Date,
        },
        placeOfIssue: {
            type: String,
        },
        gender: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const ApplicantProfile = model('ApplicantProfile', applicantProfileSchema);
