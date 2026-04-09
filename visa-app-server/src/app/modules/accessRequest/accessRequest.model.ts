import { Schema, model } from 'mongoose';
import { TAccessRequest } from './accessRequest.interface';

const accessRequestSchema = new Schema<TAccessRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    serviceName: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestDate: { type: Date, default: Date.now },
    organisationRegisteredName: { type: String },
  },
  {
    timestamps: true,
  },
);

export const AccessRequest = model<TAccessRequest>(
  'AccessRequest',
  accessRequestSchema,
);
