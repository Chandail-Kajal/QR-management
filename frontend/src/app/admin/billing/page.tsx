/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
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
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  X,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";

// ==========================================
// --- TYPES & INTERFACES ---
// ==========================================
export type Role = "ADMIN" | "USER";
export type PlanType = "Free Trial" | "Monthly Pro" | "3-Month Pro" | "Yearly Enterprise" | string;
export type Status = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
export type DurationUnit = "auto" | "days" | "months" | "years";

export interface QrBreakdown {
  url: number;
  vcard: number;
  social: number;
  file: number;
}

export interface UserBillingData {
  id: number;
  name: string;
  email: string;
  role: Role;
  plan: PlanType;
  planId?: number | null;
  subscriptionId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  status: Status;
  totalQRs: number;
  maxQRs: number;
  totalScans: number;
  firstQrDate: string; // ISO String
  monthlyRevenue: number;
  qrBreakdown: QrBreakdown;
}

export interface PlanOption {
  id: number;
  name: string;
  price: string | number;
  currency?: string;
  isFree?: boolean;
  intervalType?: string;
  intervalValue?: number;
  maxQRCodes?: number | null;
  maxTotalScans?: number | null;
  maxFolders?: number | null;
  allowCustomDesign?: boolean;
}

export interface BillingDataResult {
  users: UserBillingData[];
  plans: PlanOption[];
}

export interface BillingApiResponse {
  success?: boolean;
  users: UserBillingData[];
  plans?: PlanOption[];
}

// ==========================================
// --- REACT QUERY HOOK & FETCHER ---
// ==========================================
const fetchBillingData = async (): Promise<BillingDataResult> => {
  const res = await api.get("/billing");
  const data: BillingApiResponse | UserBillingData[] = res.data;
  if (Array.isArray(data)) {
    return { users: data, plans: [] };
  }
  return {
    users: data.users || [],
    plans: data.plans || [],
  };
};

export function useUserBillingData(
  options?: Omit<UseQueryOptions<BillingDataResult, Error>, "queryKey" | "queryFn">
) {
  return useQuery<BillingDataResult, Error>({
    queryKey: ["admin", "billing-data"],
    queryFn: fetchBillingData,
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

// ==========================================
// --- HELPER DURATION CALCULATOR ---
// ==========================================
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

// ==========================================
// --- ASSIGN PLAN MODAL COMPONENT ---
// ==========================================
interface AssignPlanModalProps {
  user: UserBillingData;
  plans: PlanOption[];
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

function AssignPlanModal({ user, plans, onClose, onSuccess }: AssignPlanModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(
    user.planId ?? (plans.length > 0 ? plans[0].id : null)
  );
  const [subStatus, setSubStatus] = useState<"ACTIVE" | "TRIALING">("ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId) {
      setErrorMsg("Please select a subscription plan.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.post("/billing/assign-plan", {
        userId: user.id,
        planId: selectedPlanId,
        status: subStatus,
      });

      if (res.data?.success) {
        onSuccess(res.data.message || `Successfully connected ${user.name} to the plan.`);
        onClose();
      } else {
        setErrorMsg(res.data?.message || "Failed to connect plan.");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "An error occurred while connecting plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-purple-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Zap className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Connect User to Plan</h3>
              <p className="text-xs text-purple-200">Assign or update subscription for {user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* User Preview Card */}
          <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                Current Plan
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{user.plan}</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Plan Selection List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Subscription Plan
            </label>
            {plans.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                No active plans found in the system.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {plans.map((p) => {
                  const isSelected = selectedPlanId === p.id;
                  const priceDisplay = p.isFree || Number(p.price) === 0 ? "Free" : `$${p.price}`;
                  const intervalText = p.intervalType ? ` / ${p.intervalValue ?? 1} ${p.intervalType.toLowerCase()}` : "";

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/90 shadow-sm"
                          : "border-slate-200 hover:border-purple-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-purple-600 bg-purple-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{p.name}</span>
                            {p.isFree && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            Max {p.maxQRCodes ?? "Unlimited"} QRs • {p.maxFolders ?? "Custom"} Folders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-sm text-purple-700">{priceDisplay}</span>
                        <span className="text-[11px] text-slate-400">{intervalText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Subscription Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSubStatus("ACTIVE")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  subStatus === "ACTIVE"
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Active Subscription
              </button>
              <button
                type="button"
                onClick={() => setSubStatus("TRIALING")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  subStatus === "TRIALING"
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Trial Mode
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedPlanId}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Connect Plan Now
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// --- MAIN COMPONENT ---
// ==========================================
export default function AdminBillingPage() {
  // Fetch dynamic data from /api/v1/billing using React Query
  const { data = { users: [], plans: [] }, isLoading, isError, error, refetch } = useUserBillingData();

  const users = data.users || [];
  const plans = data.plans || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("ALL");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("auto");
  const [sortField, setSortField] = useState<keyof UserBillingData | "duration">("firstQrDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  // Plan connection modal state
  const [selectedUserForPlan, setSelectedUserForPlan] = useState<UserBillingData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User count calculation per plan
  const planCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: users.length };

    plans.forEach((p) => {
      counts[p.name] = users.filter(
        (u) =>
          u.plan.toLowerCase() === p.name.toLowerCase() ||
          (u.planId !== null && u.planId !== undefined && u.planId === p.id)
      ).length;
    });

    const freeTrialCount = users.filter(
      (u) => u.plan.toLowerCase() === "free trial" || !u.planId
    ).length;
    counts["Free Trial"] = freeTrialCount;

    return counts;
  }, [users, plans]);

  const isUserMatchingPlan = (user: UserBillingData, planFilter: string) => {
    if (planFilter === "ALL") return true;
    if (planFilter.toLowerCase() === "free trial") {
      return user.plan.toLowerCase() === "free trial" || !uPlanMatchesAnyPaid(user);
    }
    return (
      user.plan.toLowerCase() === planFilter.toLowerCase() ||
      (user.planId !== null && user.planId !== undefined && String(user.planId) === planFilter)
    );
  };

  function uPlanMatchesAnyPaid(u: UserBillingData) {
    return plans.some(
      (p) =>
        u.plan.toLowerCase() === p.name.toLowerCase() ||
        (u.planId !== null && u.planId !== undefined && u.planId === p.id)
    );
  }

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
          !searchQuery.trim() ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlan = isUserMatchingPlan(user, selectedPlan);
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

  const handlePlanAssigned = (msg: string) => {
    setToastMessage(msg);
    refetch();
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Fetching billing analytics...</p>
        </div>
      </div>
    );
  }

  // --- RENDER ERROR STATE ---
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-rose-100 max-w-md text-center">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Failed to load data</h3>
            <p className="text-xs text-slate-500 mt-1">{error?.message || "An unexpected error occurred."}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 font-sans">
      {/* SUCCESS TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-purple-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/30 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-purple-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CONNECT PLAN MODAL */}
      {selectedUserForPlan && (
        <AssignPlanModal
          user={selectedUserForPlan}
          plans={plans}
          onClose={() => setSelectedUserForPlan(null)}
          onSuccess={handlePlanAssigned}
        />
      )}

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
              Monitor user lifecycle, QR age duration, usage caps, and connect users directly to active subscription plans.
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
              {/* Dynamic Plan Filter Dropdown */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-sm">
                <Filter className="w-4 h-4 text-purple-600" />
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="bg-transparent text-slate-700 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="ALL">All Plans ({users.length})</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({planCounts[p.name] ?? 0})
                    </option>
                  ))}
                  {!plans.some((p) => p.name.toLowerCase() === "free trial") && (
                    <option value="Free Trial">
                      Free Trial ({planCounts["Free Trial"] ?? 0})
                    </option>
                  )}
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

          {/* Quick Plan Filter Tabs with dynamic user counts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-purple-600" /> Plans:
            </span>
            <button
              onClick={() => setSelectedPlan("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedPlan === "ALL"
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-purple-700 border border-slate-200"
              }`}
            >
              <span>All Plans</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                  selectedPlan === "ALL"
                    ? "bg-white/20 text-white"
                    : "bg-purple-100 text-purple-700 font-bold"
                }`}
              >
                {users.length}
              </span>
            </button>

            {plans.map((p) => {
              const isSelected = selectedPlan === p.name;
              const count = planCounts[p.name] ?? 0;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-purple-700 border border-slate-200"
                  }`}
                >
                  <span>{p.name}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 text-purple-700 font-bold"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {!plans.some((p) => p.name.toLowerCase() === "free trial") && (
              <button
                onClick={() => setSelectedPlan("Free Trial")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedPlan === "Free Trial"
                    ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-purple-700 border border-slate-200"
                }`}
              >
                <span>Free Trial</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                    selectedPlan === "Free Trial"
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 text-purple-700 font-bold"
                  }`}
                >
                  {planCounts["Free Trial"] ?? 0}
                </span>
              </button>
            )}
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
                  <th className="py-4 px-4 text-center pr-6">Manage</th>
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
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                  {user.plan}
                                </div>
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUserForPlan(user);
                                }}
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] rounded-lg border border-purple-200 transition-all shrink-0"
                              >
                                Connect Plan
                              </button>
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
                                  <div>
                                    <h4 className="font-bold text-purple-900 text-sm">
                                      QR Distribution & Subscription Management
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {user.startDate ? `Subscribed from ${new Date(user.startDate).toLocaleDateString()}` : "No active subscription start"}
                                      {user.endDate ? ` until ${new Date(user.endDate).toLocaleDateString()}` : ""}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setSelectedUserForPlan(user)}
                                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                                    >
                                      <Zap className="w-3.5 h-3.5" />
                                      Upgrade / Manage Plan
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">URL QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown?.url ?? 0}</p>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">vCard QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown?.vcard ?? 0}</p>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">Social QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown?.social ?? 0}</p>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 font-medium">File Upload QRs</span>
                                    <p className="text-lg font-bold text-slate-800 mt-0.5">{user.qrBreakdown?.file ?? 0}</p>
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