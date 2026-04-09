import { z } from 'zod';

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(14),
    }),
});

const requestEmailChangeValidationSchema = z.object({
    body: z.object({
        newEmail: z.string().email(),
    }),
});

const verifyEmailChangeValidationSchema = z.object({
    body: z.object({
        newEmail: z.string().email(),
        otp: z.string().length(6),
    }),
});

const forgotPasswordValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

const resetPasswordValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
        newPassword: z.string().min(14),
    }),
});

export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    requestEmailChangeValidationSchema,
    verifyEmailChangeValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
};
