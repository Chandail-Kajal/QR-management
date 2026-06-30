"use client";

import { VCardQRContent, WifiQRContent } from "@/types";
import { RedirectRenderer } from "./redirect-renderer";
import { VCardRenderer } from "./vcard-renderer";
import { WifiRenderer } from "./wifi-qr-renderer";

type Redirect = {
  destinationUrl: string;
};

export function QRRenderer({
  renderMode,
  content,
}: {
  renderMode: "REDIRECT" | "VCARD" | "WIFI";
  content: Redirect | VCardQRContent | WifiQRContent;
}) {
  switch (renderMode) {
    case "REDIRECT":
      return (
        <RedirectRenderer
          destinationUrl={(content as Redirect).destinationUrl}
        />
      );

    case "VCARD":
      return <VCardRenderer content={content as VCardQRContent} />;

    case "WIFI":
      return <WifiRenderer content={content as WifiQRContent}/>

    default:
      return <div>Unsupported QR Type</div>;
  }
}
