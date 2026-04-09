/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TUserRole = 'superAdmin' | 'admin' | 'agent' | 'applicant';

export type TSecretQuestion = {
    question: string;
    answer: string;
};

export interface TUser {
    _id?: string;
    organizationId?: string;
    name: string;
    email: string;
    password?: string;
    role: TUserRole;
    phone?: string;
    mobilePhone?: string;
    secretQuestions?: TSecretQuestion[];
    profileImg?: string;
    isDeleted: boolean;
    status: 'active' | 'blocked';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserModel extends Model<TUser> {
    isUserExistsByEmail(email: string): Promise<TUser | null>;
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
