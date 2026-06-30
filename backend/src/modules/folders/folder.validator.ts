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

export const listFoldersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export type ListFolderQuery = z.infer<typeof listFoldersSchema>