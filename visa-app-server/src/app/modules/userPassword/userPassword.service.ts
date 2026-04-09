import { TUserPassword } from './userPassword.interface';
import { UserPassword } from './userPassword.model';

const upsertUserPassword = async (payload: TUserPassword) => {
    const isExist = await UserPassword.findOne({ userId: payload.userId });
    if (isExist) {
        return await UserPassword.findOneAndUpdate(
            { userId: payload.userId },
            payload,
            { new: true },
        );
    }
    return await UserPassword.create(payload);
};

const getAllUserPasswords = async () => {
    return await UserPassword.find().populate('userId').sort({ createdAt: -1 });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateEmail = async (userId: any, oldEmail: string, newEmail: string) => {
    return await UserPassword.findOneAndUpdate(
        { userId, email: oldEmail },
        { email: newEmail },
        { new: true }
    );
};

export const UserPasswordService = {
    upsertUserPassword,
    getAllUserPasswords,
    updateEmail,
};
