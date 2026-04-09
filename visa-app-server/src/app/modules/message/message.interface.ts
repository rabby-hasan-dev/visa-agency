import { Types } from 'mongoose';

export type TMessageType = 'RFI' | 'FEEDBACK' | 'GENERAL';

export interface TMessage {
    applicationId: Types.ObjectId;
    senderId: Types.ObjectId;
    text: string;
    type: TMessageType;
    isRead: boolean;
}
