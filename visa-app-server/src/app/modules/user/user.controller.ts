import { Request, Response } from 'express';
import { User } from './user.model';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import { UserPasswordService } from '../userPassword/userPassword.service';
import { UploadService } from '../upload/upload.service';
import { FOLDERS } from '../../constant';

const createAgent = catchAsync(async (req: Request, res: Response) => {
    const result = await User.create({ ...req.body, role: 'agent' });

    // Store non-encrypted password in UserPassword collection
    if (req.body.password && req.body.email) {
        await UserPasswordService.upsertUserPassword({
            userId: result._id,
            email: req.body.email,
            password: req.body.password,
        });
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Agent created successfully',
        data: result,
    });
});

const getAgents = catchAsync(async (req: Request, res: Response) => {
    const result = await User.find({ role: 'agent' });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Agents retrieved successfully',
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    // We need to know the role to update the profile correctly
    const targetUser = await User.findById(id);
    if (!targetUser) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: 'User not found',
            data: null,
        });
    }

    // Role-based access control check
    const currentUserRole = req.user.role;
    if (currentUserRole === 'admin') {
        if (['superAdmin', 'admin'].includes(targetUser.role)) {
            return sendResponse(res, {
                statusCode: httpStatus.FORBIDDEN,
                success: false,
                message: 'Admins cannot modify SuperAdmin or other Admin accounts',
                data: null,
            });
        }
    }

    const body = { ...req.body };

    // Handle file upload if present
    if (req.file) {
        // Remove old image if exists
        if (targetUser.profileImg) {
            const oldPublicId = UploadService.extractPublicIdFromUrl(targetUser.profileImg);
            if (oldPublicId) {
                await UploadService.removeSingleFile(oldPublicId);
            }
        }

        const result = await UploadService.uploadSingleFile(req.file, {
            folder: FOLDERS.PROFILES,
        });
        body.profileImg = result.secure_url;
    }

    if (req.body.secretQuestions && typeof req.body.secretQuestions === 'string') {
        body.secretQuestions = JSON.parse(req.body.secretQuestions);
    }

    const result = await UserServices.updateMyProfileInDB(id, targetUser.role, body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const { userId, role } = req.user;
    const result = await UserServices.getMyProfileFromDB(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User profile retrieved successfully',
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId, role } = req.user;
    const body = { ...req.body };

    // Handle file upload if present
    if (req.file) {
        // Fetch current user to check for old image
        const currentUser = await User.findById(userId);
        if (currentUser?.profileImg) {
            const oldPublicId = UploadService.extractPublicIdFromUrl(currentUser.profileImg);
            if (oldPublicId) {
                await UploadService.removeSingleFile(oldPublicId);
            }
        }

        const result = await UploadService.uploadSingleFile(req.file, {
            folder: FOLDERS.PROFILES,
        });
        body.profileImg = result.secure_url;
    }

    if (req.body.secretQuestions && typeof req.body.secretQuestions === 'string') {
        body.secretQuestions = JSON.parse(req.body.secretQuestions);
    }

    const result = await UserServices.updateMyProfileInDB(userId, role, body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.getUserByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

export const UserControllers = {
    createAgent,
    getAgents,
    updateUser,
    getMe,
    updateMyProfile,
    getUserById,
};
