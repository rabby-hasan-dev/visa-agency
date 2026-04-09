import { Schema, model } from 'mongoose';
import { TMessage } from './message.interface';

const messageSchema = new Schema<TMessage>(
    {
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: 'VisaApplication',
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['RFI', 'FEEDBACK', 'GENERAL'],
            default: 'GENERAL',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Message = model<TMessage>('Message', messageSchema);
