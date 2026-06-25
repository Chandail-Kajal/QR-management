// lib/qr-resolver.ts

import { QRContent } from "@/types/qr";

export function resolveDestination(content: QRContent): string | null {
  switch (content.type) {
    case "URL":
      return content.url;

    case "WHATSAPP": {
      const message = encodeURIComponent(content.message ?? "");

      return message
        ? `https://wa.me/${content.phone}?text=${message}`
        : `https://wa.me/${content.phone}`;
    }

    case "EMAIL": {
      const params = new URLSearchParams();

      if (content.subject) {
        params.set("subject", content.subject);
      }

      if (content.body) {
        params.set("body", content.body);
      }

      const query = params.toString();

      return query
        ? `mailto:${content.email}?${query}`
        : `mailto:${content.email}`;
    }

    case "PHONE":
      return `tel:${content.phone}`;

    case "SMS": {
      const message = encodeURIComponent(content.message ?? "");

      return message
        ? `sms:${content.phone}?body=${message}`
        : `sms:${content.phone}`;
    }

    case "GOOGLE_REVIEW":
      return content.reviewUrl;

    case "INSTAGRAM":
    case "FACEBOOK":
    case "LINKEDIN":
    case "X":
    case "YOUTUBE":
    case "TIKTOK":
      return content.url;

    default:
      return null;
  }
}
