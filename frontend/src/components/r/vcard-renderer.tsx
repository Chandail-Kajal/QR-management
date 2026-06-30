"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VCardQRContent } from "@/types";

export function downloadVCard(content: VCardQRContent) {
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${content.lastName ?? ""};${content.firstName}`,
    `FN:${content.firstName} ${content.lastName ?? ""}`,
    content.phone && `TEL:${content.phone}`,
    content.email && `EMAIL:${content.email}`,
    content.company && `ORG:${content.company}`,
    content.website && `URL:${content.website}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

  const blob = new Blob([vcf], {
    type: "text/vcard",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = `${content.firstName}.vcf`;

  a.click();

  URL.revokeObjectURL(url);
}

export function VCardRenderer({ content }: { content: VCardQRContent }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 rounded-4xl blur-3xl opacity-60 bg-linear-to-r from-purple-500 via-pink-500 to-cyan-500 animate-pulse" />

        <Card
          className="
            relative
            w-105
            overflow-hidden
            rounded-4xl
            border-white/20
            bg-black/80
            backdrop-blur-xl
          "
        >
          <div
            className="
              absolute inset-0
              bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,.15)_45%,transparent_65%)]
              animate-[shine_4s_linear_infinite]
            "
          />

          <div
            className="
              absolute inset-0
              bg-linear-to-br
              from-fuchsia-500/20
              via-transparent
              to-cyan-500/20
            "
          />

          <div className="relative z-10 p-8">
            <div className="flex flex-col items-center">
              <div
                className="
                  h-32 w-32 rounded-full
                  bg-linear-to-br
                  from-purple-500
                  to-cyan-500
                  p-0.75
                "
              >
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                  <span className="text-5xl">👤</span>
                </div>
              </div>

              <h1 className="mt-6 text-3xl font-bold text-white">
                {content.firstName} {content.lastName}
              </h1>

              <p className="text-cyan-300">{content.title}</p>

              <p className="text-zinc-400">{content.company}</p>
            </div>

            <div className="mt-8 space-y-3">
              {content.phone && <InfoRow label="Phone" value={content.phone} />}

              {content.email && <InfoRow label="Email" value={content.email} />}

              {content.website && (
                <InfoRow label="Website" value={content.website} />
              )}
            </div>

            <Button
              className="
                mt-8 w-full
                bg-linear-to-r
                from-fuchsia-600
                to-cyan-600
                text-white
                hover:opacity-90
              "
              onClick={() => downloadVCard(content)}
            >
              Save Contact
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        rounded-xl
        border border-white/10
        bg-white/5
        p-3
      "
    >
      <div className="text-xs text-zinc-400">{label}</div>

      <div className="text-white">{value}</div>
    </div>
  );
}

