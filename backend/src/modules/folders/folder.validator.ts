import { z } from "zod";

export const folderIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createFolderSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const updateFolderSchema = z.object({
  name: z.coerce.string().trim().min(1).max(100),
});

export const folderOptionQuery = z.object({
  search: z.string().trim().min(3),
});

export const folderNameSchema = z.object({
  name: z.coerce.string().trim(),
});

export const listFoldersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export type CreateFolder = z.infer<typeof createFolderSchema>;
export type updateFolder = z.infer<typeof updateFolderSchema>;
export type ListFolderQuery = z.infer<typeof listFoldersSchema>;
