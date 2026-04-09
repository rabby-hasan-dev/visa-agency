import { z } from "zod";

export const applicationSchema = z.object({
    familyName: z.string().min(1, "Family name is required"),
    givenNames: z.string().min(1, "Given names are required"),
    sex: z.enum(["Male", "Female", "Other"]),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    passportNumber: z.string().min(1, "Passport number is required"),
    countryOfPassport: z.string().min(1, "Country of passport is required"),
    nationality: z.string().min(1, "Nationality is required"),
    dateOfIssue: z.string().min(1, "Date of issue is required"),
    dateOfExpiry: z.string().min(1, "Date of expiry is required"),
    placeOfIssue: z.string().min(1, "Place of issue is required"),
    hasAusGrantNum: z.boolean().nullable(),
    hasNationalId: z.boolean().nullable(),
    birthTown: z.string().min(1, "Town / City is required"),
    birthState: z.string().min(1, "State / Province is required"),
    countryOfBirth: z.string().min(1, "Country of birth is required"),
    relationshipStatus: z.string().min(1, "Relationship status is required"),
    hasOtherNames: z.boolean().nullable(),
    citizenOfPassportCountry: z.boolean().nullable(),
    citizenOtherCountry: z.boolean().nullable(),
    healthExam: z.boolean().nullable(),
    // Additional fields can be added as optional or partial
}).partial(); // Making it partial since not all steps have all fields

export type ApplicationValues = z.infer<typeof applicationSchema>;
