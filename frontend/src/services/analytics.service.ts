/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import { IApiResponse } from "@/types";
import { DashboardResponse, QRAnalyticsData } from "@/types/analytics";

export const getQRAnalytics = async (
  qrId: string,
  query: {
    fromDate?: Date | string;
    toDate?: Date | string;
    days: number;
  },
) => {
  const res = await api.get<IApiResponse<QRAnalyticsData>>(
    `/analytics/${qrId}`,
    {
      params: query,
    },
  );
  return res.data.data;
};

export const getWorkspaceDashboard = async () => {
  const res = await api.get<IApiResponse<DashboardResponse>>(
    "/analytics/dashboard",
  );
  return res.data.data;
};
