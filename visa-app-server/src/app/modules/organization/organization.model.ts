import { Schema, model } from 'mongoose';

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        logo: String,
        subscriptionPlan: {
            type: String,
            enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'],
            default: 'FREE',
        },
        address: {
            street: String,
            city: String,
            country: String,
        },
        contactEmail: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Organization = model('Organization', organizationSchema);
