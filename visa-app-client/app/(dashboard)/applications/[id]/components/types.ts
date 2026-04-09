export interface ApplicationData {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  paymentId?: string;
  currency?: string;
  visaTypeId?: string;
  visaCategory: string;
  formData?: Record<string, unknown>;
  totalAmount?: number;
  feeBreakdown?: { label: string; amount: number }[];
  createdByAgentId?: string;
  clientId?: {
    name?: string;
    dateOfBirth?: string;
    email?: string;
  };
  email?: string;
  profile?: {
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    passportNumber?: string;
    nationality?: string;
    dateOfIssue?: string;
    dateOfExpiry?: string;
    placeOfIssue?: string;
    dateOfBirth?: string;
  };
  passportNumber?: string;
  nationality?: string;
  statusHistory?: {
    status: string;
    updatedBy: {
      name: string;
      role: string;
    };
    updatedAt: string;
    remarks?: string;
  }[];
  trn?: string;
  vln?: string;
  updateRequests?: { type: string; data: Record<string, unknown>; submittedAt: string }[];
  adminRequests?: {
    type: 'ATTACH_DOCUMENT' | 'BIOMETRIC' | 'INFORMATION';
    message: string;
    details?: string;
    biometricDetails?: {
      location?: string;
      appointmentDate?: string;
      requiredIdentifiers?: string[];
      requiredDocuments?: string[];
    };
    status: 'PENDING' | 'RESOLVED';
    createdAt: string;
  }[];
  documents?: { originalName: string; url: string; documentType?: string; description?: string; uploadedAt?: string }[];
}