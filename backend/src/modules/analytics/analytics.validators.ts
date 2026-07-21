import { z } from "zod";

export const qrAnalyticsParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const timelineQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).default(30),
});

export const qrIdSchema = z.object({
  qrId: z.coerce.number().int().positive(),
});

export const getQRAnalyticsQuery = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  days: z.coerce.number().int().positive().default(7),
});

export type GetQrAnalyticsQuery = z.infer<typeof getQRAnalyticsQuery>;

export type TimelineQueryInput = z.infer<typeof timelineQuerySchema>;
