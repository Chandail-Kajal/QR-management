"use client";

import {
  QRContent,
  QRType,
  SocialQRContent,
  VCardQRContent,
  WifiQRContent,
} from "@/types";
import { RedirectRenderer } from "./redirect-renderer";
import { VCardRenderer } from "./vcard-renderer";
import { WifiRenderer } from "./wifi-qr-renderer";
import { SocialRenderer } from "./social-links-renderer";

type Redirect = {
  destinationUrl: string;
};

export function QRRenderer({
  renderMode,
  content,
}: {
  renderMode: "REDIRECT" | QRType;
  content: Redirect | QRContent;
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
      return <WifiRenderer content={content as WifiQRContent} />;

    case "SOCIAL":
      return <SocialRenderer content={content as SocialQRContent} />;

    default:
      return <div>Unsupported QR Type</div>;
  }
}
