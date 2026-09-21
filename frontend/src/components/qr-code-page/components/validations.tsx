import { QRStatus, QRType } from "@/types";
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
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().optional(),
});

const googleReviewSchema = z.object({
  placeId: z.string().optional(),
  reviewUrl: z.string().url("Invalid Google Review URL"),
});

const instagramSchema = z.object({
  username: z.string().optional(),
  url: z.string().url("Invalid Instagram URL"),
});

const facebookSchema = z.object({
  pageName: z.string().optional(),
  url: z.string().url("Invalid Facebook URL"),
});

const linkedinSchema = z.object({
  profileName: z.string().optional(),
  url: z.string().url("Invalid LinkedIn URL"),
});

const xSchema = z.object({
  username: z.string().optional(),
  url: z.string().url("Invalid X URL"),
});

const youtubeSchema = z.object({
  channelName: z.string().optional(),
  url: z.string().url("Invalid YouTube URL"),
});

const tiktokSchema = z.object({
  username: z.string().optional(),
  url: z.string().url("Invalid TikTok URL"),
});

const socialSchema = z
  .object({
    platform: z.string().optional(),
    username: z.string().optional(),
    profileName: z.string().optional(),
    url: z.string().url("Invalid Profile URL").optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    links: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (data) =>
      Boolean(
        data.url || (data.links && Object.values(data.links).some(Boolean)),
      ),
    {
      message: "Profile URL is required",
      path: ["url"],
    },
  );

const fileSchema = z.object({
  fileId: z.number().int().positive().optional(),
  fileName: z.string().optional(),
  url: z.string().optional(),
});

export const createQRSchema = z
  .object({
    name: z.string().min(1).max(100),

    type: z.string(),

    status: z.string().default("ACTIVE"),

    scanLimit: z.number().int().positive().nullable().optional(),

    content: z.any(),
  })
  .superRefine((data, ctx) => {
    const validators: Record<string, z.ZodTypeAny> = {
      URL: urlSchema,
      TEXT: textSchema,
      EMAIL: emailSchema,
      PHONE: phoneSchema,
      SMS: smsSchema,
      WIFI: wifiSchema,
      VCARD: vcardSchema,
      WHATSAPP: whatsappSchema,
      GOOGLE_REVIEW: googleReviewSchema,
      INSTAGRAM: instagramSchema,
      FACEBOOK: facebookSchema,
      LINKEDIN: linkedinSchema,
      X: xSchema,
      YOUTUBE: youtubeSchema,
      TIKTOK: tiktokSchema,
      SOCIAL: socialSchema,
      FILE: fileSchema,
    };

    const validator = validators[data.type];

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

export type CreateQRForm = z.infer<
  typeof createQRSchema & { status: QRStatus; type: QRType }
>;
