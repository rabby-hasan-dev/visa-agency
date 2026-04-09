import { z } from 'zod';

export const accountDetailsSchema = z.object({
    title: z.string().optional(),
    givenName: z.string().min(1, 'Given name is required'),
    familyName: z.string().min(1, 'Family name is required'),
    phone: z.string().min(1, 'Phone is required'),
    mobilePhone: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip/Postcode is required'),
    country: z.string().min(1, 'Country is required'),
    companyName: z.string().optional(),
    marn: z.string().optional(),
    licenseNumber: z.string().optional(),
});

export const emailUpdateSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const passwordUpdateSchema = z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(14, 'Password must be at least 14 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const secretQuestionsUpdateSchema = z.object({
    q1: z.string().min(1, 'Question 1 is required'),
    a1: z.string().min(1, 'Answer 1 is required'),
    q2: z.string().min(1, 'Question 2 is required'),
    a2: z.string().min(1, 'Answer 2 is required'),
    q3: z.string().min(1, 'Question 3 is required'),
    a3: z.string().min(1, 'Answer 3 is required'),
    q4: z.string().optional(),
    a4: z.string().optional(),
    q5: z.string().optional(),
    a5: z.string().optional(),
});

export type AccountDetailsValues = z.infer<typeof accountDetailsSchema>;
export type EmailUpdateValues = z.infer<typeof emailUpdateSchema>;
export type PasswordUpdateValues = z.infer<typeof passwordUpdateSchema>;
export type SecretQuestionsUpdateValues = z.infer<typeof secretQuestionsUpdateSchema>;
