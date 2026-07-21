"use client";

import { useParams } from "next/navigation";
import { QRRenderer } from "../../../components/r/qr-renderer";
import { IApiResponse, VCardQRContent } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`/resolved-qr-token/${token}`],
    queryFn: async () => {
      try {
        const res = await api.get<IApiResponse<QRResponse>>(
          `/public/qr/${token}`,
        );
        return res.data.data;
      } catch (error: unknown) {
        const message = (error as AxiosError<IApiResponse<null>>).response?.data
          .message;
        throw new Error(message);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data || isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        {error?.message}
      </div>
    );
  }

  return (
    <QRRenderer
      content={data?.content as QRResponse["content"]}
      renderMode={data?.renderMode as QRResponse["renderMode"]}
    />
  );
}
