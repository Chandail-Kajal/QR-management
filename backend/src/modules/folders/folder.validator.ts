import { z } from "zod";

export const folderIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createFolderSchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(100),
});