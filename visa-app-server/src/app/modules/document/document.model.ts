import { Schema, model } from 'mongoose';

const documentSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'VisaApplication',
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    documentType: String, // Passport, Birth Certificate, etc.
  },
  {
    timestamps: true,
  }
);

export const Document = model('Document', documentSchema);
