import { z } from "zod";

export const createQRSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),

  destinationUrl: z.string().url("Invalid URL"),
});

export type CreateQRForm = z.infer<typeof createQRSchema>;
