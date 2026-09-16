import { QRType } from "@/generated/prisma/enums";
import { QRContent, VCardQRContent, WifiQRContent } from "@/types";

interface Redirect {
  destinationUrl: string;
}

export interface QRResponse {
  renderMode: "REDIRECT" | "VCARD" | "WIFI" | QRType;
  content: Redirect | VCardQRContent | WifiQRContent | QRContent;
}
