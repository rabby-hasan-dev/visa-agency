import { Schema, model } from 'mongoose';
import { TAgentProfile } from './agentProfile.interface';

const agentProfileSchema = new Schema<TAgentProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        licenseNumber: { type: String, required: true, unique: true },
        marn: { type: String }, // Migration Agent Registration Number
        companyName: { type: String },
        businessAddress: { type: String },
        title: { type: String },
        givenNames: { type: String },
        familyName: { type: String },
        city: { type: String },
        stateProvince: { type: String },
        zipPostalCode: { type: String },
        country: { type: String },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const AgentProfile = model<TAgentProfile>(
    'AgentProfile',
    agentProfileSchema,
);
