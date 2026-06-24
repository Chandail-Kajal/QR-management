"use client";

import { useEffect, useState } from "react";

export default function QRRedirectPage({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveQR() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/qrs/r/${token}`,
          {
            method: "GET",
            credentials: "omit",
          },
        );

        if (!response.ok) {
          throw new Error("Invalid QR code");
        }

        const data = await response.json();

        window.location.replace(data.redirectUrl);
      } catch (err) {
        setError("This QR code is unavailable.");
      }
    }

    resolveQR();
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">{error}</div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Redirecting...</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we prepare your destination.
        </p>
      </div>
    </div>
  );
}
