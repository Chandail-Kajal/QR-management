import { VCardQRContent, WifiQRContent } from "@/types";

interface Redirect {
  destinationUrl: string;
}

export interface QRResponse {
  renderMode: "REDIRECT" | "VCARD" |"WIFI";
  content: Redirect | VCardQRContent |WifiQRContent;
}
