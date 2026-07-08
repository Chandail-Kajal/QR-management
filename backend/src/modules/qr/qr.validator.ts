import { QRStatus, QRType } from "@/generated/prisma/enums";
import { z } from "zod";

export const createQRSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(QRType),
  content: z.record(z.any(), z.any()),

  folderId: z.number().int().positive().optional(),

  scanLimit: z.number().int().positive().nullable().optional(),
});

export const listQRSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.nativeEnum(QRStatus).optional(),
  type: z.nativeEnum(QRType).optional()
});

export type CreateQRInput = z.infer<typeof createQRSchema>;

export type ListQRInput = z.infer<typeof listQRSchema>;

export const qrIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateQRSchema = z.object({
  name: z.string().min(1).max(100).optional(),

  status: z.nativeEnum(QRStatus).optional(),

  content: z.record(z.any(), z.any()),

  folderId: z.number().int().positive().optional(),

  scanLimit: z.number().int().positive().nullable().optional(),
});

export type UpdateQRInput = z.infer<typeof updateQRSchema>;
export type QRIdInput = z.infer<typeof qrIdSchema>;
