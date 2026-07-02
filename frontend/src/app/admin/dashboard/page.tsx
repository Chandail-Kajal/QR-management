"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TrendingUp, QrCode, Users, Trophy } from "lucide-react";
import { getWorkspaceDashboard } from "@/services/analytics.service";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";

type DashboardResponse = {
  totalScans: number;
  growth: number;
  activeQrCodes: number;
  uniqueVisitors: number;
  topPerformer: {
    id: number;
    name: string;
    scans: number;
  } | null;
  scanVolume: Record<string, number>;
  deviceSplit: {
    device: string;
    scans: number;
    percent: number;
  }[];
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

export default function DashboardPage() {
  const { setBreadcrumbs, clearBreadcrumbs } = useUIStore();
  const { selectedWorkspaceId } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", selectedWorkspaceId],
    queryFn: async () => getWorkspaceDashboard(),
  });

  const chartData = useMemo(() => {
    if (!data) return [];

    return Object.entries(data.scanVolume).map(([date, scans]) => ({
      date: new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      scans,
    }));
  }, [data]);

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard", href: "/admin/dashboard" }]);

    return () => {
      clearBreadcrumbs();
    };
  }, []);

  if (isLoading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="relative">
            <CardContent className="flex items-center justify-between pt-6">
              <div
                className={`absolute -top-4 left-0 right-0 w-full p-0.5 rounded-2xl bg-linear-to-r from-purple-600 to-pink-400`}
              />
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <h2 className="text-3xl font-bold">
                  {data.summary.totalScans.toLocaleString()}
                </h2>

                <p className="mt-2 text-sm text-green-600">
                  ↑ {data.summary.growth}% vs last month
                </p>
              </div>

              <TrendingUp className="h-8 w-8 text-primary" />
            </CardContent>
          </div>
        </Card>

        <Card>
          <div className="relative">
            <CardContent className="flex items-center justify-between pt-6">
              <div
                className={`absolute -top-4 left-0 right-0 w-full p-0.5 rounded-2xl bg-linear-to-r from-emerald-600 to-green-400`}
              />
              <div>
                <p className="text-sm text-muted-foreground">Active QR Codes</p>

                <h2 className="text-3xl font-bold">
                  {data.summary.activeQrCodes}
                </h2>
              </div>

              <QrCode className="h-8 w-8 text-primary" />
            </CardContent>
          </div>
        </Card>

        <Card>
          <div className="relative">
            <CardContent className="flex items-center justify-between pt-6">
              <div
                className={`absolute -top-4 left-0 right-0 w-full p-0.5 rounded-2xl bg-linear-to-r from-amber-600 to-yellow-400`}
              />
              <div>
                <p className="text-sm text-muted-foreground">Top Performer</p>

                <h2 className="text-xl font-semibold">
                  {data.summary.topPerformer?.name ?? "-"}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {data.summary.topPerformer?.scans ?? 0} scans
                </p>
              </div>

              <Trophy className="h-8 w-8 text-amber-500" />
            </CardContent>
          </div>
        </Card>

        <Card>
          <div className="relative">
            <CardContent className="flex items-center justify-between pt-6">
              <div
                className={`absolute -top-4 left-0 right-0 w-full p-0.5 rounded-2xl bg-linear-to-r from-red-600 to-orange-400`}
              />
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <h2 className="text-3xl font-bold">
                  {data.summary.uniqueVisitors.toLocaleString()}
                </h2>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Line */}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scan Volume</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#6366F1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Split</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data.deviceSplit}
                  dataKey="scans"
                  nameKey="device"
                  outerRadius={100}
                  ///@ts-expect-error 'device not exists'
                  label={({ device, percent }) =>
                    `${device} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {data.deviceSplit.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {data.deviceSplit.map((item, index) => (
                <div
                  key={item.device}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: COLORS[index],
                      }}
                    />

                    {item.device}
                  </div>

                  <span>{item.percent}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
