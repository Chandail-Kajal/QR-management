import { z } from "zod";

export const workspaceIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100),

  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});