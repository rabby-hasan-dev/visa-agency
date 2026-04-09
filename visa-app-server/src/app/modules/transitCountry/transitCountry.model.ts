import { Schema, model } from 'mongoose';
import { TTransitCountry } from './transitCountry.interface';

const transitCountrySchema = new Schema<TTransitCountry>(
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
            uppercase: true,
            maxlength: 3,
        },
        flagEmoji: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true, // true = this country DOES transit through Australia
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            trim: true,
        },
        surcharge: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: 'AUD',
        },
        exchangeRate: {
            type: Number,
            default: 1,
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

// Filter soft-deleted docs automatically
transitCountrySchema.pre('find', function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

transitCountrySchema.pre('findOne', function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

export const TransitCountry = model<TTransitCountry>(
    'TransitCountry',
    transitCountrySchema,
);
