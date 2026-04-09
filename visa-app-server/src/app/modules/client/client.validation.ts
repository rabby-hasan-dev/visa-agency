import { z } from 'zod';

const createClientValidationSchema = z.object({
    body: z.object({
        fullName: z.string(),
        passportNumber: z.string(),
        dateOfBirth: z.string(),
        nationality: z.string(),
        email: z.string().email(),
        phone: z.string(),
    }),
});

const updateClientValidationSchema = z.object({
    body: z.object({
        fullName: z.string().optional(),
        passportNumber: z.string().optional(),
        dateOfBirth: z.string().optional(),
        nationality: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
    }),
});

export const ClientValidation = {
    createClientValidationSchema,
    updateClientValidationSchema,
};
