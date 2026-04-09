import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';


const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false, // process.env.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully!',
        data: {
            accessToken,
        },
    });
});

const registerUser = catchAsync(async (req, res) => {
    const result = await AuthServices.registerUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User registered successfully',
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;

    await AuthServices.changePassword(req.user, passwordData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully !',
        data: null,
    });
});

const requestEmailChange = catchAsync(async (req, res) => {
    await AuthServices.requestEmailChange(req.user, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Verification code sent to your new email !',
        data: null,
    });
});

const verifyEmailChange = catchAsync(async (req, res) => {
    await AuthServices.verifyEmailChange(req.user, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Email updated successfully !',
        data: null,
    });
});

const forgotPassword = catchAsync(async (req, res) => {
    await AuthServices.forgotPassword(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Verification code sent to your email !',
        data: null,
    });
});

const resetPassword = catchAsync(async (req, res) => {
    await AuthServices.resetPassword(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successfully !',
        data: null,
    });
});

export const AuthControllers = {
    loginUser,
    registerUser,
    changePassword,
    requestEmailChange,
    verifyEmailChange,
    forgotPassword,
    resetPassword,
};
