import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'Username (Email) is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
    title: z.string().optional(),
    givenNames: z.string().min(1, 'Given names are required'),
    familyName: z.string().min(1, 'Family name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    phone: z.string().min(1, 'Phone is required'),
    mobilePhone: z.string().optional(),
    companyName: z.string().min(1, 'Organisation is required'),
    streetAddress: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'Suburb/Town is required'),
    stateProvince: z.string().min(1, 'State is required'),
    zipPostalCode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required'),
    licenseNumber: z.string().min(1, 'License Number is required'),
    marn: z.string().optional(),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    q1: z.string().min(1, 'Secret question 1 is required'),
    a1: z.string().min(1, 'Answer 1 is required'),
    q2: z.string().min(1, 'Secret question 2 is required'),
    a2: z.string().min(1, 'Answer 2 is required'),
    q3: z.string().min(1, 'Secret question 3 is required'),
    a3: z.string().min(1, 'Answer 3 is required'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
