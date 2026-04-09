import { z } from 'zod';

const createVisaTypeSchema = z.object({
    body: z.object({
        name: z
            .string({ error: 'Visa type name is required' })
            .min(2, 'Name must be at least 2 characters')
            .trim(),
        code: z
            .string({ error: 'Visa code is required' })
            .min(1, 'Code is required')
            .trim(),
        category: z
            .string({ error: 'Category is required' })
            .min(2, 'Category must be at least 2 characters')
            .trim(),
        description: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        sortOrder: z.number().int().optional().default(0),
        totalSteps: z
            .number({ error: 'Total steps is required' })
            .int()
            .min(1, 'Must have at least 1 step')
            .max(20, 'Cannot exceed 20 steps'),
        sidebarLinks: z.array(z.string()).optional().default([]),
        baseFee: z.number().min(0),
        biometricFee: z.number().optional().default(0),
        serviceFee: z.number().optional().default(0),
    }),
});

const updateVisaTypeSchema = z.object({
    body: z.object({
        name: z.string().min(2).trim().optional(),
        code: z.string().min(1).trim().optional(),
        category: z.string().min(2).trim().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
        totalSteps: z.number().int().min(1).max(20).optional(),
        sidebarLinks: z.array(z.string()).optional(),
        baseFee: z.number().min(0).optional(),
        biometricFee: z.number().optional(),
        serviceFee: z.number().optional(),
    }),
});

export const VisaTypeValidation = {
    createVisaTypeSchema,
    updateVisaTypeSchema,
};
