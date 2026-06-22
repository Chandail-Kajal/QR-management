import { z } from "zod";

export const createQRSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),

  destinationUrl: z.string().url("Invalid URL"),

  scanLimit: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return null;
      return Number(value);
    })
    .refine(
      (value) => value === null || (Number.isInteger(value) && value > 0),
      "Scan limit must be a positive number",
    ),
});

export type CreateQRForm = z.infer<typeof createQRSchema>;
