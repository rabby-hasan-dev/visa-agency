import { Schema, model } from 'mongoose';
import { TEnquiry } from './enquiry.interface';

const enquirySchema = new Schema<TEnquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'responded', 'archived'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

export const Enquiry = model<TEnquiry>('Enquiry', enquirySchema);
