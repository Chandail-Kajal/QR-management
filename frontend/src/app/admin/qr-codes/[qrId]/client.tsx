/* eslint-disable react-hooks/static-components */
"use client";

import { useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Activity, Users, ScanLine, Clock, Dot } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getQRAnalytics } from "@/services/analytics.service";
import { getQRDetails } from "@/services/qr.service";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { Breadcrumbs } from "@/components/bread-crumbs";
import { getQRTypeIcon } from "@/lib/preview-type-icon";
import { QRStatus, QRType } from "@/types";
import { QRStatusBadge } from "../components/qr-status-badge";

export function QRAnalyticsPage({ qrId }: { qrId: string }) {
  const { setBreadcrumbs } = useUIStore();
  const { selectedWorkspaceId } = useAuthStore();

  const { data: analytics, isLoading } = useQuery({
    queryKey: [`analytics/${qrId}`, selectedWorkspaceId],
    queryFn: async () => getQRAnalytics(qrId, { days: 30 }),
  });

  const { data: qrData } = useQuery({
    queryKey: [`analytics/${qrId}/details`, selectedWorkspaceId],
    queryFn: async () => getQRDetails(qrId),
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Qr-Codes", href: "/admin/qr-codes" },
      {
        label: qrData?.name || "Qr",
        href: `/admin/qr-codes/${qrId}/analytics`,
      },
    ]);
  }, [qrId, qrData?.name]);

  if (isLoading || !analytics) {
    return <div className="p-10">Loading...</div>;
  }

  const { overview, scanTrend, scanTime } = analytics;

  const Icon = getQRTypeIcon(qrData?.type as QRType);

  return (
    <>
      <Breadcrumbs />
      <div className="mt-4 space-y-6 pb-20">
        <div className="w-full flex-row">
          <div className="flex flex-row gap-2">
            <div className="h-14 w-14 bg-accent/30 rounded-lg flex justify-center items-center">
              <Icon className="text-text-muted" size={26} />
            </div>
            <div className="flex flex-col justify-between w-70">
              <span className="flex flex-row text-sm gap-0 items-center justify-start">
                {qrData?.type}
                <Dot />
                {qrData?.name}
              </span>
              <span className="flex flex-row gap-2 text-xs items-center">
                <QRStatusBadge status={qrData?.status as QRStatus} />
                <span className="border-r text-text-muted px-1">
                  {qrData?.type}
                </span>
                <span className="border-r px-1 text-text-muted">
                  {new Date(qrData?.createdAt as string).toLocaleDateString()}
                </span>
                <span className="text-nowrap px-1 text-text-muted">
                  Token: {qrData?.token}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard
            gradientClasses="from-purple-600 to-pink-400"
            title="Total scans"
            value={overview.totalScans}
            icon={<ScanLine className="h-5 w-5" />}
          />

          <StatCard
            gradientClasses="from-emerald-600 to-green-400"
            title="Unique visitors"
            value={overview.uniqueVisitors}
            subtitle={`${overview.uniqueRate}% unique rate`}
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            gradientClasses="from-amber-600 to-yellow-400"
            title="Scans today"
            value={overview.scansToday}
            icon={<Activity className="h-5 w-5" />}
          />

          <StatCard
            gradientClasses="from-red-600 to-orange-400"
            title="Last scanned"
            value={
              overview.lastScannedAt
                ? new Date(overview.lastScannedAt).toLocaleTimeString()
                : "-"
            }
            subtitle={
              overview.lastScannedAt
                ? new Date(overview.lastScannedAt).toLocaleDateString()
                : ""
            }
            icon={<Clock className="h-5 w-5" />}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Scan Trend</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={scanTrend}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Area dataKey="scans" fillOpacity={0.2} />

                  <Line dataKey="uniqueVisitors" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scan Time</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <TimelineItem label="Morning" value={scanTime.morning} />

              <TimelineItem label="Afternoon" value={scanTime.afternoon} />

              <TimelineItem label="Evening" value={scanTime.evening} />

              <TimelineItem label="Night" value={scanTime.night} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SimpleChart
            title="Browsers"
            data={analytics.browsers.map((x) => ({
              name: x.browser,
              value: x._count,
            }))}
          />

          <SimpleChart
            title="Devices"
            data={analytics.devices.map((x) => ({
              name: x.device,
              value: x._count,
            }))}
          />

          <SimpleChart
            title="Operating Systems"
            data={analytics.os.map((x) => ({
              name: x.os,
              value: x._count,
            }))}
          />
        </div>
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradientClasses = "from-purple-500 to-pink-500",
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: React.ReactNode;
  gradientClasses: string;
}) {
  return (
    <Card>
      <div className="relative">
        <CardContent className="pt-6">
          <div
            className={`absolute -top-4 left-0 right-0 w-full p-0.5 rounded-2xl bg-linear-to-r ${gradientClasses}`}
          ></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h2 className="mt-2 text-3xl font-bold">{value}</h2>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {icon}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function TimelineItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span>{label}</span>

        <span>{value}</span>
      </div>

      <Progress value={value * 10} />
    </div>
  );
}

function SimpleChart({
  title,
  data,
}: {
  title: string;
  data: {
    name: string | undefined;
    value: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Line dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
