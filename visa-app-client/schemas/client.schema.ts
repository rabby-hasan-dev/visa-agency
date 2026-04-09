import { z } from "zod";

export const clientSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    passportNumber: z.string().min(5, "Passport number must be at least 5 characters"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationality: z.string().min(1, "Nationality is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number must be at least 5 characters"),
});

export type ClientValues = z.infer<typeof clientSchema>;
