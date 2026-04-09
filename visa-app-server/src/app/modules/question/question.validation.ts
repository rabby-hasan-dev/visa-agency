import { z } from 'zod';

const fieldTypeEnum = z.enum([
    'text',
    'textarea',
    'select',
    'radio',
    'checkbox',
    'date',
    'file',
    'boolean',
    'section-header',
    'number',
    'email',
    'phone',
]);

const fieldOptionSchema = z.object({
    label: z.string().min(1, 'Option label is required'),
    value: z.string().min(1, 'Option value is required'),
});

const showIfSchema = z.object({
    field: z.string().min(1, 'showIf.field is required'),
    value: z.string().min(1, 'showIf.value is required'),
});

const createQuestionSchema = z.object({
    body: z.object({
        visaTypeId: z.string({ error: 'visaTypeId is required' }).min(1),
        stepNumber: z
            .number({ error: 'stepNumber is required' })
            .int()
            .min(1)
            .max(20),
        stepLabel: z.string({ error: 'stepLabel is required' }).min(1).trim(),
        fieldKey: z.string({ error: 'fieldKey is required' }).min(1).trim(),
        label: z.string({ error: 'label is required' }).min(1).trim(),
        fieldType: fieldTypeEnum,
        options: z.array(fieldOptionSchema).optional().default([]),
        isRequired: z.boolean().optional().default(false),
        placeholder: z.string().optional(),
        helpText: z.string().optional(),
        showIf: showIfSchema.optional(),
        sortOrder: z.number().int().optional().default(0),
    }),
});

const updateQuestionSchema = z.object({
    body: z.object({
        stepNumber: z.number().int().min(1).max(20).optional(),
        stepLabel: z.string().min(1).trim().optional(),
        fieldKey: z.string().min(1).trim().optional(),
        label: z.string().min(1).trim().optional(),
        fieldType: fieldTypeEnum.optional(),
        options: z.array(fieldOptionSchema).optional(),
        isRequired: z.boolean().optional(),
        placeholder: z.string().optional(),
        helpText: z.string().optional(),
        showIf: showIfSchema.optional(),
        sortOrder: z.number().int().optional(),
    }),
});

const reorderQuestionsSchema = z.object({
    body: z.object({
        items: z.array(
            z.object({
                id: z.string().min(1, 'id is required'),
                sortOrder: z.number().int(),
            }),
        ).min(1, 'items array must not be empty'),
    }),
});

export const QuestionValidation = {
    createQuestionSchema,
    updateQuestionSchema,
    reorderQuestionsSchema,
};
