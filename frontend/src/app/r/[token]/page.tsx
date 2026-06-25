"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRRenderer } from "../../../components/r/QRRenderer";
import { VCardQRContent } from "@/types";

type Redirect = {
  destinationUrl: string;
};

type QRResponse = {
  renderMode: "REDIRECT" | "VCARD";
  content: Redirect | VCardQRContent;
};

export default function QRPage() {
  const params = useParams();
  const token = params.token as string;

  const [qr, setQr] = useState<QRResponse | null>(null);

  useEffect(() => {
    if (!token) return;

    async function fetchQR() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/qr/${token}`
      );

      if (!res.ok) {
        console.error("Invalid QR code");
        return;
      }

      const data = (await res.json()) as QRResponse;
      setQr(data);
    }

    fetchQR();
  }, [token]);

  if (!qr) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <QRRenderer
      content={qr.content}
      renderMode={qr.renderMode}
    />
  );
}