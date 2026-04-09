import { Types } from 'mongoose';
import { TSteps, TVisaApplicationStatus } from './visaApplication.constant';

export type TStatusHistory = {
    status: TVisaApplicationStatus;
    updatedBy: Types.ObjectId;
    updatedAt: Date;
    remarks?: string;
};

export type TAdminRequest = {
    type: 'ATTACH_DOCUMENT' | 'BIOMETRIC' | 'INFORMATION';
    message: string;
    details?: string;
    biometricDetails?: {
        location?: string;
        appointmentDate?: Date;
        requiredIdentifiers?: string[];
        requiredDocuments?: string[];
    };
    status: 'PENDING' | 'RESOLVED';
    createdAt: Date;
    resolvedAt?: Date;
};

export type TVisaApplication = {
    organizationId?: Types.ObjectId;
    clientId?: Types.ObjectId;
    applicantName?: string; // Denormalized for fast searching
    email?: string;
    trn?: string;
    vln?: string;
    createdByAgentId?: Types.ObjectId;
    visaCategory: string;
    visaTypeId?: Types.ObjectId;       // FK → VisaType (new dynamic system)
    status: TVisaApplicationStatus;
    currentStep: number;
    formData: TSteps;
    totalAmount?: number;
    currency?: string;
    paymentId?: string;
    pdfUrl?: string;
    updateRequests?: Record<string, unknown>[];
    adminRequests?: TAdminRequest[];
    documents?: { url: string; originalName: string; documentType?: string; description?: string; uploadedAt?: Date }[];
    feeBreakdown?: { label: string; amount: number }[];
    statusHistory?: TStatusHistory[];
    isDeleted: boolean;
};
