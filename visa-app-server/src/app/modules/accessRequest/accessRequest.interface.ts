import { Types } from 'mongoose';

export type TAccessRequestStatus = 'pending' | 'approved' | 'rejected';

export type TAccessRequest = {
  userId: Types.ObjectId;
  organizationId?: Types.ObjectId;
  serviceName: string;
  status: TAccessRequestStatus;
  requestDate: Date;
  organisationRegisteredName?: string;
};
