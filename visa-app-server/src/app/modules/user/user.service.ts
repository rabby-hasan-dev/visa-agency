import httpStatus from 'http-status';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AgentProfile } from '../agentProfile/agentProfile.model';
import { ApplicantProfile } from '../applicantProfile/applicantProfile.model';
import { StaffProfile } from '../staffProfile/staffProfile.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { UserPasswordService } from '../userPassword/userPassword.service';

const getMyProfileFromDB = async (userId: string, role: string) => {
    let profileData = null;

    if (role === 'agent') {
        profileData = await AgentProfile.findOne({ userId });
    } else if (role === 'applicant') {
        profileData = await ApplicantProfile.findOne({ userId });
    } else if (['admin', 'superAdmin'].includes(role)) {
        profileData = await StaffProfile.findOne({ userId });
    }

    const userData = await User.findById(userId).select('+profileImg');

    return {
        user: userData,
        profile: profileData,
    };
};

const updateMyProfileInDB = async (
    userId: string,
    role: string,
    payload: Partial<TUser & Record<string, unknown>>,
) => {
    const { name, phone, mobilePhone, password, profileImg, status, secretQuestions, ...profileData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Update User basic info
        const userUpdateData: Partial<TUser> = {};
        if (name !== undefined) userUpdateData.name = name as string;
        if (phone !== undefined) userUpdateData.phone = phone as string;
        if (mobilePhone !== undefined) userUpdateData.mobilePhone = mobilePhone as string;
        if (profileImg !== undefined) userUpdateData.profileImg = profileImg as string;
        if (status !== undefined) userUpdateData.status = status as 'active' | 'blocked';
        if (secretQuestions !== undefined && Array.isArray(secretQuestions)) {
            userUpdateData.secretQuestions = secretQuestions;
        }
        
        if (password) {
            userUpdateData.password = await bcrypt.hash(
                password as string,
                Number(config.bcrypt_salt_rounds),
            );
        }

        if (Object.keys(userUpdateData).length > 0) {
            await User.findByIdAndUpdate(userId, userUpdateData, {
                new: true,
                session,
            });

            // Update non-encrypted password in UserPassword collection if changed
            if (password) {
                const updatedUser = await User.findById(userId).session(session);
                if (updatedUser?.email) {
                    await UserPasswordService.upsertUserPassword({
                        userId: updatedUser._id,
                        email: updatedUser.email,
                        password: password as string,
                    });
                }
            }
        }

        // 2. Update Profile info based on role
        if (role === 'agent') {
            const agentProfileData: Record<string, unknown> = { ...profileData };
            // Map common field names if they differ
            const busAddress = profileData.businessAddress || profileData.streetAddress || profileData.address;
            if (busAddress !== undefined) agentProfileData.businessAddress = busAddress;
            
            // Clean undefined
            Object.keys(agentProfileData).forEach(key => agentProfileData[key] === undefined && delete agentProfileData[key]);

            if (Object.keys(agentProfileData).length > 0) {
                await AgentProfile.findOneAndUpdate({ userId }, { $set: agentProfileData }, {
                    new: true,
                    upsert: true,
                    session,
                });
            }
        } else if (role === 'applicant') {
            const applicantProfileData: Record<string, unknown> = { ...profileData };
            const address: Record<string, string> = {};
            
            const street = profileData.street || profileData.streetAddress || profileData.address;
            if (street !== undefined) address.street = street as string;
            
            if (profileData.city !== undefined) address.city = profileData.city as string;
            if (profileData.state !== undefined) address.state = profileData.state as string;
            if (profileData.stateProvince !== undefined) address.state = profileData.stateProvince as string;
            if (profileData.country !== undefined) address.country = profileData.country as string;
            
            const zipCode = profileData.zipCode || profileData.zipPostalCode || profileData.zip;
            if (zipCode !== undefined) address.zipCode = zipCode as string;

            if (Object.keys(address).length > 0) {
                applicantProfileData.address = address;
            }

            // Clean undefined
            Object.keys(applicantProfileData).forEach(key => applicantProfileData[key] === undefined && delete applicantProfileData[key]);

            if (Object.keys(applicantProfileData).length > 0) {
                await ApplicantProfile.findOneAndUpdate({ userId }, { $set: applicantProfileData }, {
                    new: true,
                    upsert: true,
                    session,
                });
            }
        } else if (['admin', 'superAdmin'].includes(role)) {
            const staffProfileData: Record<string, unknown> = { ...profileData };
            
            // Map common field names
            const street = profileData.streetAddress || profileData.address;
            if (street !== undefined) staffProfileData.streetAddress = street;
            
            const state = profileData.stateProvince || profileData.state;
            if (state !== undefined) staffProfileData.stateProvince = state;
            
            const zip = profileData.zipPostalCode || profileData.zip || profileData.postcode;
            if (zip !== undefined) staffProfileData.zipPostalCode = zip;

            // Clean undefined
            Object.keys(staffProfileData).forEach(key => staffProfileData[key] === undefined && delete staffProfileData[key]);

            if (Object.keys(staffProfileData).length > 0) {
                await StaffProfile.findOneAndUpdate({ userId }, { $set: staffProfileData }, {
                    new: true,
                    upsert: true,
                    session,
                });
            }
        }

        await session.commitTransaction();
        await session.endSession();

        return await getMyProfileFromDB(userId, role);
    } catch (err: unknown) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(
            httpStatus.BAD_REQUEST,
            (err as Error).message || 'Failed to update profile',
        );
    }
};

const getUserByIdFromDB = async (id: string) => {
    const userData = await User.findById(id).select('+profileImg');
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    let profileData = null;
    if (userData.role === 'agent') {
        profileData = await AgentProfile.findOne({ userId: id });
    } else if (userData.role === 'applicant') {
        profileData = await ApplicantProfile.findOne({ userId: id });
    } else if (['admin', 'superAdmin'].includes(userData.role)) {
        profileData = await StaffProfile.findOne({ userId: id });
    }

    return {
        user: userData,
        profile: profileData,
    };
};

export const UserServices = {
    getMyProfileFromDB,
    updateMyProfileInDB,
    getUserByIdFromDB,
};
