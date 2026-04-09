import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageServices } from './message.service';

const addMessage = catchAsync(async (req, res) => {
    const payload = {
        ...req.body,
        senderId: req.user.userId,
    };

    const result = await MessageServices.addMessage(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Message added successfully',
        data: result,
    });
});

const getApplicationMessages = catchAsync(async (req, res) => {
    const { applicationId } = req.params;
    const result = await MessageServices.getApplicationMessages(applicationId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages fetched successfully',
        data: result,
    });
});

const markMessagesAsRead = catchAsync(async (req, res) => {
    const { applicationId } = req.params;
    const result = await MessageServices.markMessagesAsRead(applicationId, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages marked as read',
        data: result,
    });
});

export const MessageControllers = {
    addMessage,
    getApplicationMessages,
    markMessagesAsRead,
};
