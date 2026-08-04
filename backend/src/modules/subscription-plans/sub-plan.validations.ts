import { z } from "zod";

export const createSubPlanSchema = z
    .object({
        name: z.coerce.string().min(1, "Name is required"),
        description: z.coerce.string().min(1, "Description is required"),

        isFree: z.coerce.boolean(),
        isActive: z.coerce.boolean(),

        price: z.coerce.number().int().optional().nullable(),

        currency: z.enum(["USD", "INR", "JPY", "EUR"]),
        intervalType: z.enum(["DAYS", "MONTHS"]),
        intervalValue: z.coerce
            .number()
            .int()
            .gt(0, "Interval value must be greater than 0"),

        maxQRCodes: z.coerce.number().int().optional().nullable(),
        maxTotalScans: z.coerce.number().int().optional().nullable(),
        maxScansPerQR: z.coerce.number().int().optional().nullable(),
        maxFolders: z.coerce.number().int().optional().nullable(),
        maxQRsPerFolder: z.coerce.number().int().optional().nullable(),
        maxFileUploads: z.coerce.number().int().optional().nullable(),
        maxFileSizeMb: z.coerce.number().int().optional().nullable(),
        maxCampaigns: z.coerce.number().int().optional().nullable(),

        allowedQRTypes: z.array(z.string()),
        analyticsHistoryDays: z.coerce.number().int().optional().nullable(),
        allowPasswordProtection: z.coerce.boolean().optional().default(false),
    })
    .superRefine((data, ctx) => {
        if (!data.isFree) {
            if (data.price == null || data.price <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["price"],
                    message: "Price must be greater than 0",
                });
            }
        }
    });

export const updateSubPlanSchema = z.object({
    name: z.coerce.string().min(1, "Name is required"),
    description: z.coerce.string().min(1, "Description is required"),

    isFree: z.coerce.boolean(),
    isActive: z.coerce.boolean(),

    price: z.coerce.number().int().optional().nullable(),

    currency: z.enum(["USD", "INR", "JPY", "EUR"]),
    intervalType: z.enum(["DAYS", "MONTHS"]),
    intervalValue: z.coerce
        .number()
        .int()
        .gt(0, "Interval value must be greater than 0"),

    maxQRCodes: z.coerce.number().int().optional().nullable(),
    maxTotalScans: z.coerce.number().int().optional().nullable(),
    maxScansPerQR: z.coerce.number().int().optional().nullable(),
    maxFolders: z.coerce.number().int().optional().nullable(),
    maxQRsPerFolder: z.coerce.number().int().optional().nullable(),
    maxFileUploads: z.coerce.number().int().optional().nullable(),
    maxFileSizeMb: z.coerce.number().int().optional().nullable(),
    maxCampaigns: z.coerce.number().int().optional().nullable(),

    allowedQRTypes: z.array(z.string()),
    analyticsHistoryDays: z.coerce.number().int().optional().nullable(),
    allowPasswordProtection: z.coerce.boolean().optional().default(false),
}).partial();

export const planId = z.object({
    id: z.coerce.number().int().gt(0)
})

export const listSubPlanSchema = z.object({
    limit: z.coerce.number().int().gt(0).optional().default(10),
    page: z.coerce.number().int().gt(0).optional().default(1)
})

export type CreateSubPlan = z.infer<typeof createSubPlanSchema>
export type UpdateSubPlan = z.infer<typeof updateSubPlanSchema>
export type ListSubPlan = z.infer<typeof listSubPlanSchema>