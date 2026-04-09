export type TAccessRequestStatus = 'pending' | 'approved' | 'rejected';

export interface TAccessRequest {
  _id: string;
  userId: string;
  organizationId?: string;
  serviceName: string;
  status: TAccessRequestStatus;
  requestDate: string;
  organisationRegisteredName?: string;
  updatedAt: string;
  createdAt: string;
}
