import crypto from "crypto";
import {
  EmailQRContent,
  FileQRContent,
  PhoneQRContent,
  QRContent,
  SmsQRContent,
  SocialQRContent,
  VCardQRContent,
  WhatsAppQRContent,
  WifiQRContent,
} from "@/types";
import { QRResponse } from "./public.types";
import { ApiError } from "@/shared/utils";

export function resolveQRDestination(content: QRContent): QRResponse {
  switch (content.type) {
    case "URL":
      return {
        renderMode: "REDIRECT",
        content: { destinationUrl: content.url },
      };

    case "TEXT":
      return {
        renderMode: "REDIRECT",
        content: {
          destinationUrl: `data:text/plain,${encodeURIComponent(content.text)}`,
        },
      };

    case "EMAIL":
      return {
        renderMode: "REDIRECT",
        content: {
          destinationUrl: buildEmailUrl(content),
        },
      };

    case "PHONE":
      return {
        renderMode: "REDIRECT",
        content: {
          destinationUrl: buildPhoneUrl(content),
        },
      };

    case "SMS":
      return {
        renderMode: "REDIRECT",
        content: { destinationUrl: buildSmsUrl(content) },
      };

    case "WIFI":
      return {
        renderMode: "WIFI",
        content:content,
      };

    case "FILE":
      return {
        renderMode: "REDIRECT",
        content: {
          destinationUrl: buildFileUrl(content),
        },
      };

    case "VCARD":
      return {
        renderMode: "VCARD",
        content: {
          ...content,
        },
      };

    case "WHATSAPP":
      return {
        renderMode: "REDIRECT",
        content: {
          destinationUrl: buildWhatsAppUrl(content),
        },
      };

    case "GOOGLE_REVIEW":
      return {
        renderMode: "REDIRECT",
        content: {
          destinationUrl: content.reviewUrl,
        },
      };

    case "INSTAGRAM":
    case "FACEBOOK":
    case "LINKEDIN":
    case "X":
    case "YOUTUBE":
    case "TIKTOK":
      return {
        renderMode: "REDIRECT",
        content: {
          destinationUrl: content.url,
        },
      };

    default:
      throw new ApiError(400, "Unsupported QR Type");
  }
}

export function buildUrl(url: string): string {
  return url;
}

export function buildEmailUrl(content: EmailQRContent) {
  const params = new URLSearchParams();

  if (content.subject) {
    params.set("subject", content.subject);
  }

  if (content.body) {
    params.set("body", content.body);
  }

  const query = params.toString();

  return query ? `mailto:${content.email}?${query}` : `mailto:${content.email}`;
}

export function buildPhoneUrl(content: PhoneQRContent) {
  return `tel:${content.phone}`;
}

export function buildSmsUrl(content: SmsQRContent) {
  const message = encodeURIComponent(content.message ?? "");

  return message
    ? `sms:${content.phone}?body=${message}`
    : `sms:${content.phone}`;
}

export function buildWhatsAppUrl(content: WhatsAppQRContent) {
  const message = encodeURIComponent(content.message ?? "");

  return message
    ? `https://wa.me/${content.phone}?text=${message}`
    : `https://wa.me/${content.phone}`;
}

export function buildWifiString(content: WifiQRContent) {
  return `WIFI:T:${content.encryption};S:${content.ssid};P:${content.password};H:${content.hidden ? "true" : "false"};;`;
}

export function buildVCardString(content: VCardQRContent) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${content.lastName ?? ""};${content.firstName}`,
    `FN:${content.firstName} ${content.lastName ?? ""}`,
    content.phone && `TEL:${content.phone}`,
    content.email && `EMAIL:${content.email}`,
    content.company && `ORG:${content.company}`,
    content.title && `TITLE:${content.title}`,
    content.website && `URL:${content.website}`,
    content.address && `ADR:${content.address}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFileUrl(content: FileQRContent) {
  return `/files/${content.fileId}`;
}

export function buildSocialLandingUrl(content: SocialQRContent): string {
  return `/social/${encodeURIComponent(content.title ?? "profile")}`;
}


export function generateVisitorId(
  ipAddress?: string | null,
  userAgent?: string | null,
) {
  const payload = `${ipAddress ?? "unknown"}|${userAgent ?? "unknown"}`;

  return crypto.createHash("sha256").update(payload).digest("hex");
}
