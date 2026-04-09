import { Schema, model } from 'mongoose';

export type TFeeSetting = {
    name: string;
    key: string;
    amount: number;
    currency: string;
    description?: string;
    isActive: boolean;
};

const feeSettingSchema = new Schema<TFeeSetting>(
    {
        name: { type: String, required: true },
        key: { type: String, required: true, unique: true },
        amount: { type: Number, required: true, default: 0 },
        currency: { type: String, default: 'AUD' },
        description: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const FeeSetting = model<TFeeSetting>('FeeSetting', feeSettingSchema);
