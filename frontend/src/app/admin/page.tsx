/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { QrCode, Sparkles, TrendingUp, BarChart3, Zap, Calendar, Plus, ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const RANGE_DATA = {
  Day: {
    labels: ["8a", "10a", "12p", "2p", "4p", "6p", "8p"],
    scans: [120, 180, 260, 310, 240, 290, 200],
    visitors: [90, 130, 190, 220, 170, 210, 140],
  },
  Week: {
    labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7"],
    scans: [1800, 2200, 2900, 3400, 4200, 3800, 4100],
    visitors: [1200, 1600, 2100, 2500, 3100, 2800, 3000],
  },
  Month: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    scans: [9200, 10400, 12100, 13800, 15200, 16900],
    visitors: [6100, 7300, 8400, 9600, 10800, 11900],
  },
};

const DEVICE_DATA = [
  { name: "iOS", value: 52, color: "#3B82F6" },
  { name: "Android", value: 35, color: "#22C55E" },
  { name: "Desktop", value: 13, color: "#F59E0B" },
];

const ACTIVITY = [
  { icon: "★", name: "Google Review QR", type: "GOOGLE REVIEW", scans: 1, time: "2 min ago" },
  { icon: "🪪", name: "vCard QR — Kajal Chandel", type: "VCARD", scans: 8, time: "18 min ago" },
  { icon: "✉", name: "Email QR", type: "EMAIL", scans: 7, time: "1 hr ago" },
  { icon: "🔗", name: "Flipcart", type: "URL", scans: 8, time: "3 hr ago" },
  { icon: "💬", name: "Shri Krishna", type: "URL", scans: 3, time: "5 hr ago" },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-xl shadow-black/10 text-xs">
      <div className="text-[#94A3B8] mb-1 font-medium">{label}</div>
      {payload.map((p: { dataKey: Key | null | undefined; fill: any; color: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; value: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; }) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-[#64748B]">{p.name}:</span>
          <span className="text-[#1E293B] font-semibold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState("Week");
  const [activeDevice, setActiveDevice] = useState(null);
  const [hoveredKpi, setHoveredKpi] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);

  const current = RANGE_DATA[range];
  const chartData = current.labels.map((label: any, i: string | number) => ({
    label,
    Scans: current.scans[i],
    Visitors: current.visitors[i],
  }));

  const totalScansInRange = current.scans.reduce((a: any, b: any) => a + b, 0);
  const totalVisitorsInRange = current.visitors.reduce((a: any, b: any) => a + b, 0);

  const sortedActivity = [...ACTIVITY].sort((a, b) =>
    sortDesc ? b.scans - a.scans : a.scans - b.scans
  );

  const kpis = [
    {
      key: "scans",
      label: "Total Targets",
      value: "12",
      icon: QrCode,
      accent: "#3B82F6",
      glow: "#2563EB",
      detail: "Across 6 active workspaces, 3 created this week.",
    },
    {
      key: "accumulated",
      label: "Accumulated Scans",
      value: totalScansInRange.toLocaleString(),
      icon: BarChart3,
      accent: "#22C55E",
      glow: "#16A34A",
      detail: `${totalVisitorsInRange.toLocaleString()} unique visitors in this period.`,
    },
    {
      key: "health",
      label: "System Health",
      value: "99.9%",
      icon: TrendingUp,
      accent: "#F59E0B",
      glow: "#D97706",
      detail: "No incidents reported in the last 30 days.",
    },
  ];

  return (
    <div className="space-y-6 p-1 relative overflow-hidden select-none bg-linear-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#EEF2F7] text-[#1E293B] min-h-screen rounded-2xl">
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-0 right-12 h-40 w-40 rounded-full bg-[#60A5FA]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-[#34D399]/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10 p-6 pb-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-white font-bold text-[10px] tracking-widest uppercase bg-linear-to-r from-[#3B82F6] to-[#6366F1] rounded-full px-3 py-1.5 w-fit shadow-md shadow-[#3B82F6]/30">
            <Sparkles className="h-3 w-3 animate-spin duration-3000" />
            <span>Workspace Overview</span>
          </div>

           

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-[#475569] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 hover:bg-[#F8FAFC] hover:border-[#3B82F6]/30 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
              <Calendar className="h-3.5 w-3.5" />
              Last 30 days
              <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-linear-to-r from-[#3B82F6] to-[#6366F1] rounded-lg px-3 py-2 hover:shadow-lg hover:shadow-[#3B82F6]/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
              <Plus className="h-3.5 w-3.5" />
              Create QR
            </button>
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-br from-[#1E293B] via-[#3B82F6] to-[#6366F1] pb-1">
          Dashboard
        </h1>

        <p className="text-sm font-medium text-[#64748B] max-w-xl leading-relaxed tracking-wide">
          Welcome back! 👋 Your dynamic QR routing engine is{" "}
          <span className="text-[#3B82F6] font-semibold underline underline-offset-4 decoration-[#3B82F6]/40">
            live and active
          </span>
          , parsing incoming analytical scan traffic.
        </p>
      </div>

      {/* KPI cards — hover to reveal detail */}
      <div className="grid gap-4 sm:grid-cols-3 px-6 relative z-10">
        {kpis.map((k) => {
          const Icon = k.icon;
          const isHovered = hoveredKpi === k.key;
          return (
            <div
              key={k.key}
              onMouseEnter={() => setHoveredKpi(k.key)}
              onMouseLeave={() => setHoveredKpi(null)}
              className="relative p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-default transition-all duration-300 overflow-hidden"
              style={{
                borderColor: isHovered ? `${k.accent}55` : undefined,
                boxShadow: isHovered ? `0 12px 24px -8px ${k.accent}33` : undefined,
              }}
            >
              {/* Soft gradient wash on hover */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${k.accent}10, transparent 60%)`,
                  opacity: isHovered ? 1 : 0,
                }}
              />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r transition-all duration-300" style={{ background: k.accent, height: isHovered ? "2.75rem" : "2.5rem" }} />
              <div className="flex items-center justify-between relative">
                <div className="space-y-1.5 pl-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] block">{k.label}</span>
                  <p className="text-3xl font-extrabold tracking-tight text-[#1E293B] transition-colors duration-200" style={{ color: isHovered ? k.glow : undefined }}>
                    {k.value}
                  </p>
                </div>
                <div
                  className="h-11 w-11 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-300"
                  style={{
                    background: `${k.accent}1A`,
                    border: `1px solid ${k.accent}33`,
                    color: k.glow,
                    transform: isHovered ? "rotate(8deg) scale(1.1)" : undefined,
                  }}
                >
                  <Icon className="h-5 w-5 stroke-2" />
                </div>
              </div>
              <div
                className="text-[11px] text-[#64748B] pl-2 overflow-hidden transition-all duration-300"
                style={{ maxHeight: isHovered ? "2.5rem" : "0px", marginTop: isHovered ? "10px" : "0px", opacity: isHovered ? 1 : 0 }}
              >
                {k.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive charts row */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr] px-6 relative z-10">
        {/* Bar chart with range toggle */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="text-sm font-semibold text-[#1E293B] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-linear-to-r from-[#3B82F6] to-[#6366F1] animate-pulse" />
              Scan volume
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-3 text-[11px] text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: "#3B82F6" }} /> Scans
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: "#22C55E" }} /> Visitors
                </span>
              </div>
              <div className="flex bg-[#F1F5F9] rounded-lg p-0.5 border border-[#E2E8F0]">
                {Object.keys(RANGE_DATA).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`text-[11px] px-3 py-1.5 rounded-md font-medium transition-all duration-200 active:scale-95 ${
                      range === r
                        ? "bg-linear-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-sm"
                        : "text-[#64748B] hover:text-[#1E293B] hover:bg-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-55">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "rgba(100,116,139,0.8)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
                />
                <Tooltip content={<ChartTooltip active={undefined} payload={undefined} label={undefined} />} cursor={{ fill: "rgba(15,23,42,0.04)" }} />
                <Bar dataKey="Scans" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Visitors" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device donut, clickable legend */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col">
          <div className="text-sm font-semibold text-[#1E293B] mb-4 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-linear-to-r from-[#F59E0B] to-[#F97316] animate-pulse" />
            Device breakdown
          </div>
          <div className="h-35 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEVICE_DATA}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={62}
                  paddingAngle={2}
                  onMouseEnter={(_, i) => setActiveDevice(DEVICE_DATA[i].name)}
                  onMouseLeave={() => setActiveDevice(null)}
                >
                  {DEVICE_DATA.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.color}
                      opacity={activeDevice && activeDevice !== d.name ? 0.35 : 1}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-[#1E293B]">
                {activeDevice ? DEVICE_DATA.find((d) => d.name === activeDevice).value : 100}%
              </span>
              <span className="text-[10px] text-[#94A3B8]">{activeDevice || "Total"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {DEVICE_DATA.map((d) => (
              <button
                key={d.name}
                onMouseEnter={() => setActiveDevice(d.name)}
                onMouseLeave={() => setActiveDevice(null)}
                className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded-lg hover:bg-[#F1F5F9] hover:scale-[1.02] active:scale-95 transition-all duration-150"
              >
                <span className="flex items-center gap-2 text-[#475569]">
                  <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="text-[#1E293B] font-semibold">{d.value}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity, sortable */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-5 mx-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-[#1E293B] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-linear-to-r from-[#22C55E] to-[#16A34A] animate-pulse" />
            Recent activity
          </div>
          <button
            onClick={() => setSortDesc((s) => !s)}
            className="text-[11px] text-[#3B82F6] hover:text-[#1E293B] active:scale-95 transition-all duration-150 font-medium"
          >
            Sort: {sortDesc ? "Most scans" : "Fewest scans"} ↻
          </button>
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {sortedActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 group hover:bg-[#F8FAFC] rounded-lg px-2 -mx-2 transition-colors duration-200">
              <div className="h-8 w-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-sm shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200">
                {a.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-[#1E293B] truncate">{a.name}</div>
                <div className="text-[11px] text-[#94A3B8]">{a.type}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[13px] font-semibold text-[#1E293B] flex items-center justify-end gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  {a.scans} scan{a.scans !== 1 ? "s" : ""}
                </div>
                <div className="text-[10px] text-[#94A3B8]">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder hint */}
      <div className="overflow-hidden border border-[#E2E8F0] rounded-2xl bg-white hover:shadow-md p-8 mx-6 mb-6 text-center shadow-sm transition-shadow duration-300 relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-b from-[#3B82F6]/5 via-[#6366F1]/5 to-transparent pointer-events-none" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#3B82F6] to-[#6366F1] text-white mb-4 shadow-lg shadow-[#3B82F6]/30">
          <Zap className="h-5 w-5 stroke-2 animate-bounce" />
        </div>
        <p className="text-xs font-medium text-[#64748B] max-w-sm leading-relaxed tracking-wide">
          Select{" "}
          <span className="text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-1.5 py-0.5 rounded-md border border-[#3B82F6]/20">
            QR Codes
          </span>{" "}
          in the sidebar links to begin creating, exporting, and managing your custom high-fidelity tracking modules. ✨
        </p>
      </div>
    </div>
  );
}
