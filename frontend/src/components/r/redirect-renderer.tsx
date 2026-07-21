"use client";

import { useEffect } from "react";

export function RedirectRenderer({
  destinationUrl,
}: {
  destinationUrl: string;
}) {
  useEffect(() => {
    if (!destinationUrl) {
      
      return
    }

    window.location.replace(destinationUrl);
  }, [destinationUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Redirecting...
    </div>
  );
}
