"use client";


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WifiQRContent } from "@/types";




export function WifiRenderer({
  content,
}: {
  content: WifiQRContent;
}) {
  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 rounded-4xl blur-3xl opacity-60 bg-linear-to-r from-blue-500 via-cyan-500 to-emerald-500 animate-pulse" />

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
              from-cyan-500/20
              via-transparent
              to-emerald-500/20
            "
          />

          <div className="relative z-10 p-8">
            <div className="flex flex-col items-center">
              <div
                className="
                  h-32 w-32 rounded-full
                  bg-linear-to-br
                  from-cyan-500
                  to-emerald-500
                  p-0.75
                "
              >
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                  <span className="text-5xl">📶</span>
                </div>
              </div>

              <h1 className="mt-6 text-3xl font-bold text-white">
                {content.ssid}
              </h1>

              <p className="text-cyan-300">
                {content.encryption}
              </p>

              <p className="text-zinc-400">
                {content.hidden ? "Hidden Network" : "Visible Network"}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <InfoRow label="SSID" value={content.ssid} />

              <InfoRow
                label="Security"
                value={content.encryption}
              />

              {content.password && (
                <InfoRow
                  label="Password"
                  value={content.password}
                />
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => copy(content.ssid)}
              >
                Copy SSID
              </Button>

              {content.password && (
                <Button
                  className="
                    flex-1
                    bg-linear-to-r
                    from-cyan-600
                    to-emerald-600
                    text-white
                    hover:opacity-90
                  "
                  onClick={() => copy(content.password!)}
                >
                  Copy Password
                </Button>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Scan this QR with your phone camera to connect automatically.
              Browsers cannot directly join Wi-Fi networks for security
              reasons.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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