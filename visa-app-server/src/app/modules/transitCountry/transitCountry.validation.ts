import { z } from 'zod';

const createTransitCountrySchema = z.object({
    body: z.object({
        name: z
            .string({ error: 'Country name is required' })
            .min(2, 'Name must be at least 2 characters')
            .trim(),
        code: z
            .string({ error: 'Country code is required' })
            .min(2, 'Code must be at least 2 characters')
            .max(3, 'Code must be at most 3 characters')
            .trim(),
        flagEmoji: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        sortOrder: z.number().int().optional().default(0),
        notes: z.string().optional(),
        surcharge: z.number().optional().default(0),
        currency: z.string().optional().default('AUD'),
        exchangeRate: z.number().optional().default(1),
    }),
});

const updateTransitCountrySchema = z.object({
    body: z.object({
        name: z.string().min(2).trim().optional(),
        code: z.string().min(2).max(3).trim().optional(),
        flagEmoji: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
        notes: z.string().optional(),
        surcharge: z.number().optional(),
        currency: z.string().optional(),
        exchangeRate: z.number().optional(),
    }),
});

export const TransitCountryValidation = {
    createTransitCountrySchema,
    updateTransitCountrySchema,
};
