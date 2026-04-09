import { TSecretQuestion } from '../user/user.interface';

export type TLoginUser = {
    email: string;
    password: string;
};

export type TRegistrationPayload = {
    email: string;
    password: string;
    role?: string;
    name: string;
    phone?: string;
    mobilePhone?: string;
    secretQuestions?: TSecretQuestion[];
    licenseNumber?: string;
    companyName?: string;
    agencyName?: string;
    marn?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    stateProvince?: string;
    country?: string;
    zipPostalCode?: string;
    passportNumber?: string;
    nationality?: string;
    dateOfBirth?: Date;
    employeeId?: string;
    department?: string;
    designation?: string;
};

export type TChangePassword = {
    oldPassword: string;
    newPassword: string;
};

export type TEmailChangeRequest = {
    newEmail: string;
};

export type TVerifyEmailChange = {
    newEmail: string;
    otp: string;
};

export type TForgotPassword = {
    email: string;
};

export type TResetPassword = {
    email: string;
    otp: string;
    newPassword: string;
};
