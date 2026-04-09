import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserPasswordService } from './userPassword.service';
import httpStatus from 'http-status';

const getAllUserPasswords = catchAsync(async (req, ri) => {
    const result = await UserPasswordService.getAllUserPasswords();

    sendResponse(ri, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User passwords retrieved successfully',
        data: result,
    });
});

export const UserPasswordController = {
    getAllUserPasswords,
};
