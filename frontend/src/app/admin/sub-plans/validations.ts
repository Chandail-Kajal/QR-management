import * as yup from "yup";


const optionalNumber = yup
    .number()
    .integer()
    .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? null : value
    )
    .nullable()
    .optional();

export const createSubPlanYupSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),

    isFree: yup.boolean().required(),
    isActive: yup.boolean().required(),

    price: yup
        .number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .when("isFree", {
            is: true,
            then: (schema) =>
                schema
                    .notRequired()
                    .nullable()
                    .min(0, "Price cannot be negative"),
            otherwise: (schema) =>
                schema
                    .required("Price is required")
                    .moreThan(0, "Price must be greater than 0"),
        }),

    currency: yup
        .string()
        .oneOf(["USD", "INR", "JPY", "EUR"] as const)
        .required("Currency is required"),

    intervalType: yup
        .string()
        .oneOf(["DAYS", "MONTHS"] as const)
        .required("Interval type is required"),

    intervalValue: yup
        .number()
        .integer()
        .moreThan(0, "Interval value must be greater than 0")
        .required("Interval value is required"),

    maxQRCodes: optionalNumber,
    maxTotalScans: optionalNumber,
    maxScansPerQR: optionalNumber,
    maxFolders: optionalNumber,
    maxQRsPerFolder: optionalNumber,
    maxFileUploads: optionalNumber,
    maxFileSizeMb: optionalNumber,
    maxCampaigns: optionalNumber,

    allowedQRTypes: yup
        .array()
        .of(yup.string().required())
        .required("Allowed QR types are required"),

    analyticsHistoryDays: optionalNumber,
    allowPasswordProtection: yup.boolean().default(false),
});

export const updateSubPlanYupSchema = createSubPlanYupSchema.partial();

export const planIdYupSchema = yup
    .number()
    .integer()
    .moreThan(0)
    .required();


export type CreateSubPlanValues = yup.InferType<typeof createSubPlanYupSchema>
export type UpdateSubPlanValues = yup.InferType<typeof updateSubPlanYupSchema>