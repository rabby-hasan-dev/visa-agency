import { Schema, model } from 'mongoose';
import { TVisaApplication } from './visaApplication.interface';
import { VISA_APPLICATION_STATUS } from './visaApplication.constant';

const visaApplicationSchema = new Schema<TVisaApplication>(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: false, // Make it optional for now
            index: true,
        },
        clientId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Optional for draft agent applications
        },
        applicantName: {
            type: String, // Denormalized name for search
        },
        email: {
            type: String, // Contact email
        },
        trn: {
            type: String,
            unique: true,
        },
        createdByAgentId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // The agent who initiated it (linked to User)
        },
        visaCategory: {
            type: String,
            required: true,
        },
        visaTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'VisaType',
            required: false,
        },
        status: {
            type: String,
            enum: Object.values(VISA_APPLICATION_STATUS),
            default: 'DRAFT',
        },
        currentStep: {
            type: Number,
            default: 1,
        },
        formData: {
            type: Object,
            default: {},
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: 'AUD',
        },
        paymentId: {
            type: String,
        },
        pdfUrl: {
            type: String,
        },
        updateRequests: {
            type: [Object],
            default: [],
        },
        adminRequests: {
            type: [
                {
                    type: { type: String, enum: ['ATTACH_DOCUMENT', 'BIOMETRIC', 'INFORMATION'], required: true },
                    message: { type: String, required: true },
                    details: { type: String },
                    biometricDetails: {
                        location: { type: String },
                        appointmentDate: { type: Date },
                        requiredIdentifiers: { type: [String] },
                        requiredDocuments: { type: [String] },
                    },
                    status: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING' },
                    createdAt: { type: Date, default: Date.now },
                    resolvedAt: { type: Date },
                },
            ],
            default: [],
        },
        documents: {
            type: [
                {
                    _id: false,
                    url: { type: String, required: true },
                    originalName: { type: String, required: true },
                    documentType: { type: String },
                    description: { type: String },
                    uploadedAt: { type: Date, default: Date.now },
                },
            ],
            default: [],
        },
        feeBreakdown: {
            type: [
                {
                    _id: false,
                    label: { type: String, required: true },
                    amount: { type: Number, required: true },
                },
            ],
            default: [],
        },
        statusHistory: {
            type: [
                {
                    status: { type: String, required: true },
                    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                    updatedAt: { type: Date, default: Date.now },
                    remarks: { type: String },
                },
            ],
            default: [],
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

export const VisaApplication = model<TVisaApplication>(
    'VisaApplication',
    visaApplicationSchema,
);
