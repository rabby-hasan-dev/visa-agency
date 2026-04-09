import { Schema, model } from 'mongoose';

const representationSchema = new Schema(
    {
        agentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        applicantId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        authorizationStatus: {
            type: String,
            enum: ['PENDING', 'AUTHORIZED', 'REVOKED', 'EXPIRED'],
            default: 'PENDING',
        },
        authorizedAt: {
            type: Date,
        },
        expiryDate: {
            type: Date,
        },
        documents: [
            {
                documentType: String,
                fileUrl: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Ensure unique active representation for an applicant by the same agent
representationSchema.index({ agentId: 1, applicantId: 1 }, { unique: true });

export const Representation = model('Representation', representationSchema);
