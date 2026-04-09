import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser, TRegistrationPayload, TChangePassword, TEmailChangeRequest, TVerifyEmailChange, TForgotPassword, TResetPassword } from './auth.interface';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import config from '../../config';
import mongoose from 'mongoose';
import { AgentProfile } from '../agentProfile/agentProfile.model';
import { ApplicantProfile } from '../applicantProfile/applicantProfile.model';
import { StaffProfile } from '../staffProfile/staffProfile.model';
import { UserPasswordService } from '../userPassword/userPassword.service';
import { sendEmail } from '../email/email.service';
import { UserOTP } from '../user/userOtp.model';

const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.isUserExistsByEmail(payload.email);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
    }

    //checking if the password is correct

    if (!user.password || !(await User.isPasswordMatched(payload.password, user.password)))
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

    //create token and sent to the  client

    const jwtPayload: JwtPayload = {
        userId: user._id as string,
        role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
        expiresIn: config.jwt_access_expires_in as SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as Secret, {
        expiresIn: config.jwt_refresh_expires_in as SignOptions['expiresIn'],
    });

    return {
        accessToken,
        refreshToken,
    };
};

const registerUser = async (payload: TRegistrationPayload) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // 1. Create User
        const userData = {
            email: payload.email,
            password: payload.password,
            role: (payload.role as string) || 'agent',
            name: payload.name,
            phone: payload.phone,
            mobilePhone: payload.mobilePhone,
            secretQuestions: payload.secretQuestions,
        };

        const newUser = await User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }

        const userId = newUser[0]._id;

        // 2. Create Profile based on role
        if (userData.role === 'agent') {
            await AgentProfile.create([{
                userId,
                licenseNumber: (payload.licenseNumber as string) || `LIC-${Date.now()}`,
                companyName: (payload.companyName as string) || (payload.agencyName as string),
                marn: payload.marn as string,
                businessAddress: payload.streetAddress as string,
                city: payload.city as string,
                stateProvince: (payload.stateProvince as string) || (payload.state as string),
                zipPostalCode: payload.zipPostalCode as string,
                country: payload.country as string,
            }], { session });
        } else if (userData.role === 'applicant') {
            await ApplicantProfile.create([{
                userId,
                passportNumber: payload.passportNumber as string,
                nationality: payload.nationality as string,
                dateOfBirth: payload.dateOfBirth as Date,
                address: {
                    street: payload.streetAddress as string,
                    city: payload.city as string,
                    state: (payload.state as string) || (payload.stateProvince as string),
                    country: payload.country as string,
                    zipCode: payload.zipPostalCode as string
                }
            }], { session });
        } else if (['admin', 'superAdmin'].includes(userData.role)) {
            await StaffProfile.create([{
                userId,
                employeeId: (payload.employeeId as string) || `EMP-${Date.now()}`,
                department: (payload.department as string) || 'Management',
                designation: (payload.designation as string) || 'Staff',
                streetAddress: payload.streetAddress as string,
                city: payload.city as string,
                stateProvince: (payload.stateProvince as string) || (payload.state as string),
                zipPostalCode: payload.zipPostalCode as string,
                country: payload.country as string,
            }], { session });
        }

        // 3. Store non-encrypted password in UserPassword collection
        await UserPasswordService.upsertUserPassword({
            userId,
            email: payload.email,
            password: payload.password,
        });

        await session.commitTransaction();
        await session.endSession();

        return newUser[0];
    } catch (err: unknown) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, (err as Error).message || 'Failed to register user');
    }
};

const changePassword = async (userData: JwtPayload, payload: TChangePassword) => {
    // checking if the user is exist
    const user = await User.findById(userData.userId).select('+password');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is already deleted
    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
    }

    //checking if the password is correct
    if (!(await User.isPasswordMatched(payload.oldPassword, user.password as string))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Old password does not match !');
    }

    // update password
    user.password = payload.newPassword;
    await user.save();

    // update UserPassword collection
    await UserPasswordService.upsertUserPassword({
        userId: user._id,
        email: user.email,
        password: payload.newPassword,
    });

    return null;
};

const requestEmailChange = async (userData: JwtPayload, payload: TEmailChangeRequest) => {
    const user = await User.findById(userData.userId);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await UserOTP.findOneAndUpdate(
        { email: user.email, type: 'EMAIL_CHANGE' },
        { otp, expiresAt, newEmail: payload.newEmail },
        { upsert: true, new: true }
    );

    await sendEmail(
        payload.newEmail,
        'Email Change Verification Code',
        `Your verification code is: ${otp}. This code will expire in 10 minutes.`
    );

    return null;
};

const verifyEmailChange = async (userData: JwtPayload, payload: TVerifyEmailChange) => {
    const user = await User.findById(userData.userId);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    const otpData = await UserOTP.findOne({
        email: user.email,
        newEmail: payload.newEmail,
        otp: payload.otp,
        type: 'EMAIL_CHANGE',
    });

    if (!otpData) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const oldEmail = user.email;
        user.email = payload.newEmail;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (user as any).save({ session });

        // Update UserPassword collection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await UserPasswordService.updateEmail(user._id as any, oldEmail, payload.newEmail);

        await UserOTP.deleteOne({ _id: otpData._id }).session(session);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }

    return null;
};

const forgotPassword = async (payload: TForgotPassword) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await UserOTP.findOneAndUpdate(
        { email: payload.email, type: 'FORGOT_PASSWORD' },
        { otp, expiresAt },
        { upsert: true, new: true }
    );

    await sendEmail(
        payload.email,
        'Password Reset Verification Code',
        `Your verification code is: ${otp}. This code will expire in 10 minutes.`
    );

    return null;
};

const resetPassword = async (payload: TResetPassword) => {
    const user = await User.findOne({ email: payload.email }).select('+password');
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    const otpData = await UserOTP.findOne({
        email: payload.email,
        otp: payload.otp,
        type: 'FORGOT_PASSWORD',
    });

    if (!otpData) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');

    // Update password
    user.password = payload.newPassword;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (user as any).save();

    // Update UserPassword collection
    await UserPasswordService.upsertUserPassword({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: user._id as any,
        email: user.email,
        password: payload.newPassword,
    });

    await UserOTP.deleteOne({ _id: otpData._id });

    return null;
};

export const AuthServices = {
    loginUser,
    registerUser,
    changePassword,
    requestEmailChange,
    verifyEmailChange,
    forgotPassword,
    resetPassword,
};
