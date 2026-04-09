import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Message } from './message.model';
import { VisaApplication } from '../visaApplication/visaApplication.model';
import { TMessage } from './message.interface';

import { sendEmail } from '../email/email.service';
import { User } from '../user/user.model';

import { TVisaApplication } from '../visaApplication/visaApplication.interface';
import { TUser } from '../user/user.interface';

const addMessage = async (payload: Partial<TMessage>) => {
    const application = await VisaApplication.findById(payload.applicationId)
        .populate('clientId')
        .populate('createdByAgentId') as unknown as TVisaApplication & { _id: string };

    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
    }

    const result = await Message.create(payload);

    // Update application updatedAt for sorting
    await VisaApplication.findByIdAndUpdate(payload.applicationId, { updatedAt: new Date() });

    // After creating the message in DB, send email notification
    try {
        const sender = await User.findById(payload.senderId);
        const agent = application.createdByAgentId as unknown as TUser | null;
        const client = application.clientId as unknown as TUser | null;
        const applicationEmail = application.email;

        // Determine recipient
        // If sender is agent, notify client/applicant
        // If sender is client or system, notify agent
        let recipientEmail = '';
        if (sender?.role === 'agent') {
            recipientEmail = client?.email || applicationEmail || '';
        } else {
            recipientEmail = agent?.email || '';
        }

        if (recipientEmail) {
            await sendEmail(
                recipientEmail,
                'New Message regarding your Visa Application',
                `You have a new message from ${sender?.name || 'the system'} regarding application ${application._id}: \n\n"${payload.text}"`
            );
        }
    } catch {
        // Log error but don't fail the message creation
    }

    return result;
};

const getApplicationMessages = async (applicationId: string) => {
    const result = await Message.find({ applicationId })
        .populate('senderId', 'name email role')
        .sort({ createdAt: 1 });
    return result;
};

const markMessagesAsRead = async (applicationId: string, userId: string) => {
    // A simplified read logic where all unread messages in the chat not from me are marked as read
    const result = await Message.updateMany(
        { applicationId, senderId: { $ne: userId }, isRead: false },
        { isRead: true }
    );
    return result;
};

export const MessageServices = {
    addMessage,
    getApplicationMessages,
    markMessagesAsRead,
};
