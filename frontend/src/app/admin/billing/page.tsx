"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Clock,
  QrCode,
  Users,
  CreditCard,
  DollarSign,
  UserCheck,
  UserX,
  MoreVertical,
} from "lucide-react";

// --- TYPES ---
type Role = "ADMIN" | "USER";
type PlanType = "Free Trial" | "Monthly Pro" | "3-Month Pro" | "Yearly Enterprise";
type Status = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
type DurationUnit = "auto" | "days" | "months" | "years";

interface UserBillingData {
  id: number;
  name: string;
  email: string;
  role: Role;
  plan: PlanType;
  status: Status;
  totalQRs: number;
  maxQRs: number;
  totalScans: number;
  firstQrDate: string; // ISO String
  monthlyRevenue: number;
  qrBreakdown: {
    url: number;
    vcard: number;
    social: number;
    file: number;
  };
}

// --- MOCK DATA ---
const INITIAL_USERS: UserBillingData[] = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex.morgan@techcorp.io",
    role: "USER",
    plan: "Yearly Enterprise",
    status: "ACTIVE",
    totalQRs: 142,
    maxQRs: 500,
    totalScans: 28400,
    firstQrDate: "2024-03-15T08:30:00Z",
    monthlyRevenue: 199,
    qrBreakdown: { url: 80, vcard: 30, social: 20, file: 12 },
  },
  {
    id: 2,
    name: "Devon Chen",
    email: "devon@designstudio.co",
    role: "USER",
    plan: "Monthly Pro",
    status: "ACTIVE",
    totalQRs: 28,
    maxQRs: 50,
    totalScans: 4120,
    firstQrDate: "2025-08-10T11:15:00Z",
    monthlyRevenue: 29,
    qrBreakdown: { url: 15, vcard: 8, social: 3, file: 2 },
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    email: "sarah.j@growthlabs.com",
    role: "ADMIN",
    plan: "3-Month Pro",
    status: "EXPIRING_SOON",
    totalQRs: 45,
    maxQRs: 50,
    totalScans: 8900,
    firstQrDate: "2025-11-01T14:20:00Z",
    monthlyRevenue: 79,
    qrBreakdown: { url: 20, vcard: 15, social: 5, file: 5 },
  },
  {
    id: 4,
    name: "Marcus Vance",
    email: "m.vance@retailhub.net",
    role: "USER",
    plan: "Free Trial",
    status: "ACTIVE",
    totalQRs: 3,
    maxQRs: 5,
    totalScans: 140,
    firstQrDate: "2026-06-20T09:00:00Z",
    monthlyRevenue: 0,
    qrBreakdown: { url: 2, vcard: 1, social: 0, file: 0 },
  },
  {
    id: 5,
    name: "Elena Rostova",
    email: "elena@globalevents.org",
    role: "USER",
    plan: "Yearly Enterprise",
    status: "ACTIVE",
    totalQRs: 210,
    maxQRs: 1000,
    totalScans: 64200,
    firstQrDate: "2023-11-12T16:45:00Z",
    monthlyRevenue: 299,
    qrBreakdown: { url: 110, vcard: 50, social: 30, file: 20 },
  },
  {
    id: 6,
    name: "Liam O'Connor",
    email: "liam@bistro99.ie",
    role: "USER",
    plan: "Monthly Pro",
    status: "EXPIRED",
    totalQRs: 18,
    maxQRs: 50,
    totalScans: 1850,
    firstQrDate: "2025-01-05T10:00:00Z",
    monthlyRevenue: 0,
    qrBreakdown: { url: 10, vcard: 4, social: 2, file: 2 },
  },
  {
    id: 7,
    name: "Priya Sharma",
    email: "priya@fittech.app",
    role: "USER",
    plan: "3-Month Pro",
    status: "ACTIVE",
    totalQRs: 32,
    maxQRs: 50,
    totalScans: 5600,
    firstQrDate: "2025-09-18T13:10:00Z",
    monthlyRevenue: 79,
    qrBreakdown: { url: 18, vcard: 8, social: 4, file: 2 },
  },
  {
    id: 8,
    name: "James Wilson",
    email: "j.wilson@consulting.com",
    role: "USER",
    plan: "Free Trial",
    status: "EXPIRED",
    totalQRs: 5,
    maxQRs: 5,
    totalScans: 890,
    firstQrDate: "2026-01-10T08:00:00Z",
    monthlyRevenue: 0,
    qrBreakdown: { url: 3, vcard: 1, social: 1, file: 0 },
  },
];

// --- HELPER DURATION CALCULATOR ---
function calculateDuration(
  startDateStr: string,
  unit: DurationUnit,
  nowDate: Date = new Date("2026-07-20T13:00:00Z")
): string {
  const start = new Date(startDateStr);
  const diffMs = nowDate.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Just created";

  if (unit === "days") return `${diffDays} days`;

  if (unit === "months") {
    const months = (diffDays / 30.4375).toFixed(1);
    return `${months} mos`;
  }

  if (unit === "years") {
    const years = (diffDays / 365.25).toFixed(1);
    return `${years} yrs`;
  }

  // AUTO MODE
  if (diffDays < 60) {
    return `${diffDays} days`;
  } else if (diffDays < 730) {
    const months = (diffDays / 30.4375).toFixed(1);
    return `${months} mos`;
  } else {
    const years = (diffDays / 365.25).toFixed(1);
    return `${years} yrs`;
  }
}

export default function AdminBillingPage() {
  const [users] = useState<UserBillingData[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("ALL");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("auto");
  const [sortField, setSortField] = useState<keyof UserBillingData | "duration">("firstQrDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  // --- STATS CALCULATIONS ---
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activePaid = users.filter((u) => u.plan !== "Free Trial" && u.status === "ACTIVE").length;
    const totalQRs = users.reduce((acc, u) => acc + u.totalQRs, 0);
    const totalRevenue = users.reduce((acc, u) => acc + u.monthlyRevenue, 0);
    return { totalUsers, activePaid, totalQRs, totalRevenue };
  }, [users]);

  // --- FILTER & SORT ---
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlan = selectedPlan === "ALL" || user.plan === selectedPlan;
        return matchesSearch && matchesPlan;
      })
      .sort((a, b) => {
        let aVal: any = a[sortField as keyof UserBillingData];
        let bVal: any = b[sortField as keyof UserBillingData];

        if (sortField === "duration" || sortField === "firstQrDate") {
          aVal = new Date(a.firstQrDate).getTime();
          bVal = new Date(b.firstQrDate).getTime();
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, searchQuery, selectedPlan, sortField, sortOrder]);

  const toggleSort = (field: keyof UserBillingData | "duration") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 p-6 rounded-2xl text-white shadow-xl shadow-purple-900/10">
          <div>
            <span className="text-purple-200 text-xs font-semibold uppercase tracking-wider bg-purple-900/50 px-2.5 py-1 rounded-full border border-purple-400/30">
              Admin Analytics
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">
              User Billing & QR Duration Tracker
            </h1>
            <p className="text-purple-100 text-sm mt-1 opacity-90">
              Monitor user lifecycle, QR age duration, usage caps, and recurring plan health.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-400/20 text-xs text-purple-100">
            <Clock className="w-4 h-4 text-purple-300" />
            <span>Active Platform Reference: <strong>2026</strong></span>
          </div>
        </div>

        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-all">
            <div className="p-3.5 bg-purple-100 text-purple-700 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalUsers}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-all">
            <div className="p-3.5 bg-purple-100 text-purple-700 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Paid Subscriptions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.activePaid}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-all">
            <div className="p-3.5 bg-purple-100 text-purple-700 rounded-xl">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Platform QRs</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalQRs.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-4 hover:border-purple-200 transition-all">
            <div className="p-3.5 bg-purple-100 text-purple-700 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-purple-700 mt-0.5">${stats.totalRevenue.toLocaleString()}/mo</h3>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Plan Filter */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-sm">
                <Filter className="w-4 h-4 text-purple-600" />
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="bg-transparent text-slate-700 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="ALL">All Plans</option>
                  <option value="Free Trial">Free Trial</option>
                  <option value="Monthly Pro">Monthly Pro</option>
                  <option value="3-Month Pro">3-Month Pro</option>
                  <option value="Yearly Enterprise">Yearly Enterprise</option>
                </select>
              </div>

              {/* Duration Unit Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200">
                <span className="px-2.5 text-slate-400">Duration Unit:</span>
                {(["auto", "days", "months", "years"] as DurationUnit[]).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setDurationUnit(unit)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all ${
                      durationUnit === unit
                        ? "bg-purple-600 text-white shadow-sm"
                        : "hover:text-purple-700"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900 text-white text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-4 pl-6">User Details</th>
                  <th className="py-4 px-4 cursor-pointer hover:bg-purple-800 transition-colors" onClick={() => toggleSort("plan")}>
                    <div className="flex items-center gap-1.5">
                      Plan & Status
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  </th>
                  <th className="py-4 px-4 cursor-pointer hover:bg-purple-800 transition-colors" onClick={() => toggleSort("totalQRs")}>
                    <div className="flex items-center gap-1.5">
                      QRs Created
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  </th>
                  <th className="py-4 px-4 cursor-pointer hover:bg-purple-800 transition-colors" onClick={() => toggleSort("duration")}>
                    <div className="flex items-center gap-1.5">
                      QR Active Duration
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  </th>
                  <th className="py-4 px-4 cursor-pointer hover:bg-purple-800 transition-colors" onClick={() => toggleSort("totalScans")}>
                    <div className="flex items-center gap-1.5">
                      Total Scans
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  </th>
                  <th className="py-4 px-4 cursor-pointer hover:bg-purple-800 transition-colors" onClick={() => toggleSort("monthlyRevenue")}>
                    <div className="flex items-center gap-1.5">
                      Monthly Rev
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center pr-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isExpanded = expandedUserId === user.id;
                    const durationText = calculateDuration(user.firstQrDate, durationUnit);
                    const usagePercent = Math.min(Math.round((user.totalQRs / user.maxQRs) * 100), 100);

                    return (
                      <React.Fragment key={user.id}>
                        <tr
                          onClick={() => toggleExpand(user.id)}
                          className={`hover:bg-purple-50/50 transition-colors cursor-pointer ${
                            isExpanded ? "bg-purple-50/80" : ""
                          }`}
                        >
                          {/* User Info */}
                          <td className="py-4 px-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                  {user.name}
                                  {user.role === "ADMIN" && (
                                    <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                                      ADMIN
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Plan & Status */}
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-slate-800">{user.plan}</div>
                              <span
                                className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                                  user.status === "ACTIVE"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : user.status === "EXPIRING_SOON"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {user.status.replace("_", " ")}
                              </span>
                            </div>
                          </td>

                          {/* QRs Created + Progress Bar */}
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-slate-900">
                                {user.totalQRs} <span className="text-xs text-slate-400 font-normal">/ {user.maxQRs}</span>
                              </div>
                              <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    usagePercent > 85 ? "bg-amber-500" : "bg-purple-600"
                                  }`}
                                  style={{ width: `${usagePercent}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* QR Duration */}
                          <td className="py-4 px-4">
                            <div className="inline-flex items-center gap-1.5 bg-purple-100/70 text-purple-900 font-bold px-2.5 py-1 rounded-lg text-xs">
                              <Clock className="w-3.5 h-3.5 text-purple-600" />
                              {durationText}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Since {new Date(user.firstQrDate).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Total Scans */}
                          <td className="py-4 px-4 font-semibold text-slate-800">
                            {user.totalScans.toLocaleString()}
                          </td>

                          {/* Monthly Revenue */}
                          <td className="py-4 px-4 font-bold text-slate-900">
                            ${user.monthlyRevenue}
                          </td>

                          {/* Expand Toggle */}
                          <td className="py-4 px-4 text-center pr-6">
                            <button className="p-1 rounded-lg hover:bg-purple-200/50 text-slate-500 hover:text-purple-700 transition-all">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-purple-700" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* EXPANDED ROW DETAILS */}
                        {isExpanded && (
                          <tr className="bg-purple-50/40 border-b border-purple-100">
                            <td colSpan={7} className="p-6">
                              <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                  <h4 className="font-bold text-purple-900 text-sm">
                                    QR Distribution & Account Controls
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-lg shadow-sm transition-all">
                                      Upgrade / Manage Plan
                                    </button>
                                    <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-lg border border-rose-200 transition-all">
                                      Deactivate Account
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">URL QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown.url}</p>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">vCard QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown.vcard}</p>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">Social QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown.social}</p>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">File Upload QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown.file}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> user records
            </div>
            <div className="flex items-center gap-1">
              <span>Sorted by <strong className="capitalize">{sortField}</strong> ({sortOrder.toUpperCase()})</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}