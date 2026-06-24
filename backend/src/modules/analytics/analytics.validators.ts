import { z } from "zod";

export const qrAnalyticsParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const timelineQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).default(30),
});

export type TimelineQueryInput = z.infer<
  typeof timelineQuerySchema
>;