/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import { ApiResponse, QRAnalyticsDTO } from "@/types";
import {
  DashboardResponse,
  DashboardSummary,
  QRAnalyticsData,
} from "@/types/analytics";
import { Summary } from "lucide-react";

export const getQRAnalytics = async (
  qrId: string,
  query: {
    fromDate?: Date | string;
    toDate?: Date | string;
    days: number;
  },
) => {
  try {
    const res = await api.get<ApiResponse<QRAnalyticsData>>(
      `/analytics/${qrId}`,
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const getWorkspaceDashboard = async () => {
  try {
    const res = await api.get<any>("/analytics/dashboard");
    return {
      summary: {
        activeQrCodes: res.data.activeQrCodes,
        growth: res.data.growth,
        totalScans: res.data.totalScans,
        uniqueVisitors: res.data.uniqueVisitors,
        topPerformer: {
          ...res.data.topPerformer,
        },
      },
      scanVolume: {
        ...res.data.scanVolume,
      },
      deviceSplit: [...res.data.deviceSplit],
    } as DashboardResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
};
