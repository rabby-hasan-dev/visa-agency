import { z } from "zod";

export const paymentSearchSchema = z.object({
    searchTerm: z.string().min(1, "Reference number or invoice number is required"),
});

export type PaymentSearchValues = z.infer<typeof paymentSearchSchema>;
