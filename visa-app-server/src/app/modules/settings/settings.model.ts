import { Schema, model } from 'mongoose';

const settingsSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            unique: true,
        enum: ['site', 'navigation', 'global_option', 'payment_config', 'cloudinary_config', 'app_config'],
        },
        // We store everything in a flexible value field based on type
        // or we can have structured fields. Sticking to structured for better validation.
        site: {
            siteName: String,
            brandName: String,
            departmentName: String,
            footerLinks: [{ label: String, href: String, isExternal: Boolean }],
            contactEmail: String,
            contactPhone: String,
            address: String,
            logoUrl: String,
            themeColor: String,
        },
        navigation: [{
            name: String,
            href: String,
            role: { type: String, enum: ['superAdmin', 'admin', 'agent', 'applicant'] },
            sortOrder: Number,
            submenu: [{ name: String, href: String }]
        }],
        globalOptions: [{
            key: String,
            label: String,
            options: [String]
        }],
        paymentConfig: {
            activeGateway: { type: String, enum: ['stripe', 'sslcommerz'], default: 'stripe' },
            stripe: {
                mode: { type: String, enum: ['test', 'live'], default: 'test' },
                testSecretKey: { type: String },
                testPublishableKey: { type: String },
                liveSecretKey: { type: String },
                livePublishableKey: { type: String },
                isEnabled: { type: Boolean, default: true },
            },
            sslcommerz: {
                mode: { type: String, enum: ['test', 'live'], default: 'test' },
                testStoreId: { type: String },
                testStorePassword: { type: String },
                liveStoreId: { type: String },
                liveStorePassword: { type: String },
                isEnabled: { type: Boolean, default: true },
            },
        },
        cloudinaryConfig: {
            cloudName: String,
            apiKey: String,
            apiSecret: String,
        },
        appConfig: {
            clientSiteUrl: String,
            backendBaseUrl: String,
            resetPassUiLink: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Settings = model('Settings', settingsSchema);
