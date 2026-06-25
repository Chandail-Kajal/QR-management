import { z } from "zod";


const urlSchema = z.object({
  url: z.url("Invalid URL"),
});

const textSchema = z.object({
  text: z.string().min(1),
});

const emailSchema = z.object({
  email: z.email(),
  subject: z.string().optional(),
  body: z.string().optional(),
});

const phoneSchema = z.object({
  phone: z.string().min(1),
});

const smsSchema = z.object({
  phone: z.string().min(1),
  message: z.string().optional(),
});

const wifiSchema = z.object({
  ssid: z.string().min(1),
  password: z.string(),
  encryption: z.enum(["WPA", "WPA2", "WEP", "NONE"]),
  hidden: z.boolean().optional(),
});

const vcardSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),

  company: z.string().optional(),
  title: z.string().optional(),

  phone: z.string().optional(),
  email: z.email().optional(),

  website: z.url().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
});

const whatsappSchema = z.object({
  phone: z.string().min(1),
  message: z.string().optional(),
});

export const createQRSchema = z
  .object({
    name: z.string().min(1).max(100),

    type: z.string(),

    status: z.string().default("ACTIVE"),

    scanLimit: z
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),

    content: z.any(),
  })
  .superRefine((data, ctx) => {
    const validators = {
      URL: urlSchema,
      TEXT: textSchema,
      EMAIL: emailSchema,
      PHONE: phoneSchema,
      SMS: smsSchema,
      WIFI: wifiSchema,
      VCARD: vcardSchema,
      WHATSAPP: whatsappSchema,
    };

    const validator =
      validators[data.type as keyof typeof validators];

    if (!validator) return;

    const result = validator.safeParse(data.content);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: "custom",
          path: ["content", ...issue.path],
          message: issue.message,
        });
      });
    }
  });

export type CreateQRForm = z.infer<typeof createQRSchema>;