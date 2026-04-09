
import { z } from 'zod';
import { USER_ROLE } from './user.constant';

const createUserValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z
            .string()
            .max(20, { message: 'Password can not be more than 20 characters' }),
        role: z.nativeEnum(USER_ROLE).optional(),
        phone: z.string(),
        companyName: z.string(),
        marn: z.string().optional(),
        dateOfBirth: z.string(),
        streetAddress: z.string(),
        city: z.string(),
        stateProvince: z.string(),
        zipPostalCode: z.string(),
        country: z.string(),
    }),
});

const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z
            .string()
            .max(20, { message: 'Password can not be more than 20 characters' })
            .optional(),
        phone: z.string().optional(),
        companyName: z.string().optional(),
        marn: z.string().optional(),
        dateOfBirth: z.string().optional(),
        streetAddress: z.string().optional(),
        city: z.string().optional(),
        stateProvince: z.string().optional(),
        zipPostalCode: z.string().optional(),
        country: z.string().optional(),
        secretQuestions: z.any().optional(),
        profileImg: z.string().optional(),
    }).passthrough(),
});

export const UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};


