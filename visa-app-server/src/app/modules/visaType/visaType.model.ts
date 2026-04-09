import { Schema, model } from 'mongoose';
import { TVisaType } from './visaType.interface';

const visaTypeSchema = new Schema<TVisaType>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        totalSteps: {
            type: Number,
            required: true,
        },
        sidebarLinks: {
            type: [String],
            default: [],
        },
        baseFee: {
            type: Number,
            required: true,
            default: 0,
        },
        biometricFee: {
            type: Number,
            default: 0,
        },
        serviceFee: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: 'AUD',
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

// Filter out soft-deleted documents on all find queries
visaTypeSchema.pre('find', function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

visaTypeSchema.pre('findOne', function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

export const VisaType = model<TVisaType>('VisaType', visaTypeSchema);
