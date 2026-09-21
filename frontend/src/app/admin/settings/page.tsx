/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  ShieldAlert,
  KeyRound,
  UserCheck,
  UserX,
  Search,
  Bell,
  CheckCircle2,
  Lock,
  User,
  XCircle,
  Save,
  Clock,
  QrCode,
  CreditCard,
  Download,
  FileSpreadsheet,
  Folder,
  BarChart3,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { changePassword } from "@/services/auth.service";

// ==========================================
// --- TYPES & INTERFACES ---
// ==========================================
export type ExportTimeRange = "1m" | "3m" | "6m" | "12m";
export type UserDurationFilter = "ALL" | "1mos" | "3mos" | "6mos" | "years";

export const DURATION_FILTER_OPTIONS = [
  { id: "ALL" as const, label: "All Users" },
  { id: "1mos" as const, label: "1mos" },
  { id: "3mos" as const, label: "3mos" },
  { id: "6mos" as const, label: "6 mos" },
  { id: "years" as const, label: "years" },
];

export interface SystemNotification {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  type: "SUBSCRIPTION_EXPIRING" | "SCAN_LIMIT_REACHED";
  message: string;
  daysRemaining?: number;
  scansLeft?: number;
  subscriptionId?: number;
  createdAt: string;
}

export interface UserFolderInfo {
  id: number;
  name: string;
  qrCount: number;
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "DEACTIVATED";
  planName: string;
  subscriptionId: number | null;
  qrsCount: number;
  totalScans?: number;
  scanCount1m?: number;
  scanCount3m?: number;
  scanCount6m?: number;
  scanCount12m?: number;
  foldersCount?: number;
  folders?: UserFolderInfo[];
  createdAt?: string;
}

export interface QRScannerRecord {
  id: number;
  name: string;
  userId: number;
  userName: string;
  folderName: string;
  scanCount1m: number;
  scanCount3m: number;
  scanCount6m: number;
  scanCount12m: number;
  createdAt: string;
}

export interface AdminSettingsData {
  notifications: SystemNotification[];
  users: ManagedUser[];
  scanners: QRScannerRecord[];
}

export interface AdminSettingsApiResponse {
  success: boolean;
  data: AdminSettingsData;
}

// Helper to format relative time on tool with days and headings count (1mos, 3mos, 6 mos, years)
function formatTimeOnTool(createdAt?: string): string {
  if (!createdAt) return "Joined recently";
  const created = new Date(createdAt);
  const diffMs = Date.now() - created.getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (days <= 0) return "Joined today • 0 days";
  if (days === 1) return "Joined 1 day ago • 1 day";
  if (days < 30) return `Joined ${days} days ago (< 1mos)`;
  
  const months = Math.floor(days / 30);
  if (months === 1) return `Joined ${days} days ago (1mos)`;
  if (months < 12) return `Joined ${days} days ago (${months}mos)`;
  
  const years = Math.floor(days / 365);
  return `Joined ${days} days ago (${years} yr${years > 1 ? "s" : ""} / years)`;
}

// FULL USER CARD MODAL COMPONENT (from-purple-600)
function FullUserCardModal({
  user,
  onClose,
  onResetPassword,
  onToggleStatus,
}: {
  user: ManagedUser;
  onClose: () => void;
  onResetPassword: (user: ManagedUser) => void;
  onToggleStatus: (userId: number) => void;
}) {
  const folders = user.folders ?? [];
  const totalScans = user.totalScans ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in-50 duration-150">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-100 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150">
        {/* Modal Banner Header - from-purple-600 */}
        <div className="bg-linear-to-r from-purple-600 via-purple-700 to-indigo-800 p-4 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 text-purple-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pr-8 sm:pr-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-xl shrink-0 border border-white/30">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight truncate">
                  {user.name}
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white">
                  {user.role}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                    user.status === "ACTIVE"
                      ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                      : "bg-rose-500/30 text-rose-200 border border-rose-400/40"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-purple-100 text-xs sm:text-sm mt-0.5 truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 text-xs text-purple-200 mt-1.5 sm:mt-2">
                <Clock className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="truncate">
                  {formatTimeOnTool(user.createdAt)}
                  {user.createdAt && (
                    <span className="text-purple-300/90 ml-1.5 font-normal">
                      • Created: {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {/* Key Metrics 4-Box Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 sm:mb-3">
              Account Overview & Metrics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Folder Box - Normal / Neutral */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Folder className="w-4 h-4 text-slate-500" /> Folders
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {user.foldersCount ?? folders.length}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">
                  Organized categories
                </div>
              </div>

              <div className="bg-indigo-50 p-3 sm:p-3.5 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  <QrCode className="w-4 h-4 text-indigo-600" /> Scanners
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {user.qrsCount}
                </div>
                <div className="text-[10px] sm:text-[11px] text-indigo-600 font-medium mt-0.5">
                  QR codes created
                </div>
              </div>

              <div className="bg-emerald-50 p-3 sm:p-3.5 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4 text-emerald-600" /> Total Scans
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
                  {totalScans.toLocaleString()}
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-700 font-medium mt-0.5">
                  Lifetime scans
                </div>
              </div>

              <div className="bg-amber-50 p-3 sm:p-3.5 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-amber-600" /> Plan
                </div>
                <div className="text-base sm:text-lg font-black text-amber-950 mt-1 truncate">
                  {user.planName}
                </div>
                <div className="text-[10px] sm:text-[11px] text-amber-700 font-medium mt-0.5">
                  Current tier
                </div>
              </div>
            </div>
          </div>

          {/* Scan Velocity Time-Window Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 sm:mb-3">
              Scan Velocity Across Time Windows
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-2xs border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Last 1 Mo
                </div>
                <div className="text-sm sm:text-base font-extrabold text-purple-700 mt-0.5">
                  {(user.scanCount1m ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-2xs border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Last 3 Mos
                </div>
                <div className="text-sm sm:text-base font-extrabold text-purple-700 mt-0.5">
                  {(user.scanCount3m ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-2xs border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Last 6 Mos
                </div>
                <div className="text-sm sm:text-base font-extrabold text-purple-700 mt-0.5">
                  {(user.scanCount6m ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-2xs border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Last 12 Mos
                </div>
                <div className="text-sm sm:text-base font-extrabold text-purple-700 mt-0.5">
                  {(user.scanCount12m ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* User Folders Breakdown - Normal / Neutral Style */}
          <div>
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Folders Created by User ({folders.length})
              </h4>
            </div>

            {folders.length === 0 ? (
              <div className="p-5 sm:p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                No folders have been created by this user yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-h-48 overflow-y-auto pr-1">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg text-slate-600 shadow-2xs shrink-0 border border-slate-200">
                        <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {folder.name}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shrink-0 ml-2">
                      {folder.qrCount} QRs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer - Side by Side Buttons */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                onClose();
                onResetPassword(user);
              }}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all inline-flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              Reset Password
            </button>

            <button
              onClick={() => onToggleStatus(user.id)}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 font-bold text-xs rounded-xl transition-all inline-flex items-center justify-center gap-1.5 ${
                user.status === "ACTIVE"
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              {user.status === "ACTIVE" ? (
                <UserX className="w-3.5 h-3.5" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-colors text-center shadow-md shadow-purple-600/20"
          >
            Close Card
          </button>
        </div>
      </div>
    </div>
  );
}

// Folders Cell Component with normal/neutral badges & +more badge
function UserFoldersCell({ folders }: { folders?: UserFolderInfo[] }) {
  const [showMorePopover, setShowMorePopover] = useState(false);
  const items = folders ?? [];

  if (items.length === 0) {
    return <span className="text-xs text-slate-400 italic">No folders</span>;
  }

  const visibleFolders = items.slice(0, 2);
  const remainingCount = items.length - 2;

  return (
    <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {visibleFolders.map((folder) => (
        <span
          key={folder.id}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
        >
          <Folder className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="max-w-28 truncate">{folder.name}</span>
          <span className="text-[10px] font-bold text-slate-600 bg-white px-1 rounded border border-slate-200">
            {folder.qrCount}
          </span>
        </span>
      ))}

      {remainingCount > 0 && (
        <div
          className="relative inline-block"
          onMouseEnter={() => setShowMorePopover(true)}
          onMouseLeave={() => setShowMorePopover(false)}
        >
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
          >
            +{remainingCount} more...
          </button>

          {showMorePopover && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                All Folders ({items.length})
              </div>
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                {items.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between text-xs px-2 py-1 rounded-md bg-slate-50 text-slate-700 font-medium border border-slate-200"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Folder className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                      {f.qrCount} QRs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// --- REACT QUERY HOOK & FETCHER ---
// ==========================================
const fetchAdminSettingsData = async (): Promise<AdminSettingsData> => {
  const res = await api.get("/settings");
  const result: AdminSettingsApiResponse | AdminSettingsData = res.data;
  if ("data" in result) {
    return result.data;
  }
  return result as AdminSettingsData;
};

export function useAdminSettingsData(
  options?: Omit<UseQueryOptions<AdminSettingsData, Error>, "queryKey" | "queryFn">
) {
  return useQuery<AdminSettingsData, Error>({
    queryKey: ["admin", "settings"],
    queryFn: fetchAdminSettingsData,
    staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

// ==========================================
// --- MAIN COMPONENT ---
// ==========================================
export default function AdminSettingsPage() {
  const { data, isLoading, isError, error, refetch } = useAdminSettingsData();

  const [activeTab, setActiveTab] = useState<"users" | "exports" | "alerts" | "security">("users");

  // Admin Credentials State
  const [adminCurrentPassword, setAdminCurrentPassword] = useState("");
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // User Management State
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userDurationFilter, setUserDurationFilter] = useState<UserDurationFilter>("ALL");
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [selectedUserForCard, setSelectedUserForCard] = useState<ManagedUser | null>(null);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<ManagedUser | null>(null);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [userActionMessage, setUserActionMessage] = useState<string | null>(null);

  // System Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Sync local state when API data resolves
  useEffect(() => {
    if (data) {
      setUsers(data.users || []);
      setNotifications(data.notifications || []);
    }
  }, [data]);

  // Read-only scanners data directly from query
  const scanners = data?.scanners ?? [];

  // --- EXPORT STATE ---
  const [exportTimeRange, setExportTimeRange] = useState<ExportTimeRange>("3m");
  const [exportSelectedUserId, setExportSelectedUserId] = useState<string>("ALL");
  const [exportSelectedFolder, setExportSelectedFolder] = useState<string>("ALL");
  const [isExporting, setIsExporting] = useState(false);

  // Available unique folders from scanners
  const availableFolders = useMemo(() => {
    return Array.from(new Set(scanners.map((s) => s.folderName)));
  }, [scanners]);

  // Filtered Users based on Search & Time on Tool Headings (1mos, 3mos, 6 mos, years)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search filter
      const matchesSearch =
        !userSearch ||
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (user.folders && user.folders.some((f) => f.name.toLowerCase().includes(userSearch.toLowerCase())));

      if (!matchesSearch) return false;

      // 2. Time Window Duration filter (Discrete intervals: 1mos, 3mos, 6mos, years)
      if (userDurationFilter === "ALL") return true;
      if (!user.createdAt) return false;

      const createdTime = new Date(user.createdAt).getTime();
      if (isNaN(createdTime)) return false;

      const diffMs = Date.now() - createdTime;
      const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      if (userDurationFilter === "1mos") return days <= 30;
      if (userDurationFilter === "3mos") return days > 30 && days <= 90;
      if (userDurationFilter === "6mos") return days > 90 && days <= 180;
      if (userDurationFilter === "years") return days > 180;

      return true;
    });
  }, [users, userSearch, userDurationFilter]);

  // Filtered Scanners for Preview Table
  const filteredScanners = useMemo(() => {
    return scanners.filter((scanner) => {
      const matchesUser = exportSelectedUserId === "ALL" || scanner.userId === Number(exportSelectedUserId);
      const matchesFolder = exportSelectedFolder === "ALL" || scanner.folderName === exportSelectedFolder;
      return matchesUser && matchesFolder;
    });
  }, [scanners, exportSelectedUserId, exportSelectedFolder]);

  // CSV EXPORT GENERATOR
  const handleGenerateCSVExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      const headers = ["Scanner ID", "Scanner Name", "User Name", "Folder Name", "Scan Count", "Creation Date"];
      const rows = filteredScanners.map((scanner) => {
        let scans = scanner.scanCount3m;
        if (exportTimeRange === "1m") scans = scanner.scanCount1m;
        if (exportTimeRange === "6m") scans = scanner.scanCount6m;
        if (exportTimeRange === "12m") scans = scanner.scanCount12m;

        return [
          scanner.id,
          `"${scanner.name}"`,
          `"${scanner.userName}"`,
          `"${scanner.folderName}"`,
          scans,
          scanner.createdAt,
        ];
      });

      const csvContent =
        "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `qr_scan_analytics_${exportTimeRange}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setUserActionMessage(`Successfully exported ${filteredScanners.length} QR scanner records.`);
    }, 600);
  };

  // --- HANDLERS ---
  const handleAdminPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCurrentPassword || !adminNewPassword || !adminConfirmPassword) {
      setSecurityMessage({ text: "Please fill in all password fields.", isError: true });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setSecurityMessage({ text: "New passwords do not match.", isError: true });
      return;
    }
    try {
      await changePassword({ newPassword: adminNewPassword, currentPassword: adminCurrentPassword });
      setSecurityMessage({ text: "Admin password updated successfully!", isError: false });
      setAdminCurrentPassword("");
      setAdminNewPassword("");
      setAdminConfirmPassword("");
    } catch (error) {
      const message = (error as Error).message;
      setSecurityMessage({ text: message, isError: true });
    }
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
          setUserActionMessage(`User ${u.name} is now ${newStatus.toLowerCase()}.`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleUserPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForPassword || !newUserPassword) return;
    setUserActionMessage(`Password successfully updated for ${selectedUserForPassword.name}.`);
    setSelectedUserForPassword(null);
    setNewUserPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading settings dashboard...</p>
        </div>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        {/* Banner Header - from-purple-600 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-purple-600 via-purple-700 to-indigo-800 p-5 sm:p-6 rounded-2xl text-white shadow-xl shadow-purple-900/10">
          <div>
            <span className="text-purple-200 text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
              Admin Control Center
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">
              Settings & User Folder Analytics
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm mt-1 opacity-90">
              Inspect user accounts, folders, scanner creation, time on tool, and scan metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-xl border border-white/20 text-xs text-white w-fit shrink-0">
            <Bell className="w-4 h-4 text-amber-300" />
            <span>
              Pending Alerts: <strong>{notifications.length}</strong>
            </span>
          </div>
        </div>

        {userActionMessage && (
          <div className="p-3.5 sm:p-4 bg-purple-50 border border-purple-200 text-purple-900 text-xs sm:text-sm rounded-xl flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{userActionMessage}</span>
            </div>
            <button
              onClick={() => setUserActionMessage(null)}
              className="text-slate-500 hover:text-slate-800 shrink-0"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* NAVIGATION TABS (from-purple-600) */}
        <div className="flex overflow-x-auto no-scrollbar bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs w-full md:w-fit gap-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <User className="w-4 h-4" />
            User Accounts & Folders
          </button>

          <button
            onClick={() => setActiveTab("exports")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "exports"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Scan History Exports
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 relative ${
              activeTab === "alerts"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <Bell className="w-4 h-4" />
            Expiry Alerts
            {notifications.length > 0 && (
              <span className="ml-1 bg-amber-400 text-purple-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "security"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <Lock className="w-4 h-4" />
            Admin Credentials
          </button>
        </div>

        {/* TAB 1: USER ACCOUNTS & FOLDERS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* FILTER & TIME WINDOW CONTROL PANEL (1mos, 3mos, 6 mos, years) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users or folders..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all bg-slate-50/50"
                  />
                </div>

                {/* Duration Filter Headings: 1mos, 3mos, 6 mos, years */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    Joined:
                  </span>
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1 overflow-x-auto">
                    {DURATION_FILTER_OPTIONS.map((range) => {
                      const isActive = userDurationFilter === range.id;
                      return (
                        <button
                          key={range.id}
                          type="button"
                          onClick={() => setUserDurationFilter(range.id)}
                          className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-center transition-all shrink-0 text-xs font-bold cursor-pointer ${
                            isActive
                              ? "bg-purple-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-purple-700 hover:bg-white"
                          }`}
                        >
                          {range.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>
                    Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> user accounts
                  </span>
                  {userDurationFilter !== "ALL" && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                      Active: {DURATION_FILTER_OPTIONS.find((o) => o.id === userDurationFilter)?.label} ({filteredUsers.length})
                    </span>
                  )}
                  {(userDurationFilter !== "ALL" || userSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDurationFilter("ALL");
                        setUserSearch("");
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
                <span className="text-purple-600 font-medium text-[11px] sm:text-xs">
                  Hover row to open full-width preview card • Click row to open full detailed card
                </span>
              </div>
            </div>

            {/* USERS TABLE WITH from-purple-600 HEADER */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="bg-linear-to-r from-purple-600 via-purple-700 to-indigo-700 text-white text-xs font-semibold uppercase tracking-wider select-none">
                      <th className="py-3.5 sm:py-4 px-4 pl-5 sm:pl-6">User Details</th>
                      <th className="py-3.5 sm:py-4 px-4">Folders</th>
                      <th className="py-3.5 sm:py-4 px-4">Scanners</th>
                      <th className="py-3.5 sm:py-4 px-4">Scan Counts</th>
                      <th className="py-3.5 sm:py-4 px-4">Plan & Status</th>
                      <th className="py-3.5 sm:py-4 px-4 text-right pr-5 sm:pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr
                          onMouseEnter={() => setHoveredUserId(user.id)}
                          onMouseLeave={() => setHoveredUserId(null)}
                          onClick={() => setSelectedUserForCard(user)}
                          className={`transition-colors group cursor-pointer ${
                            hoveredUserId === user.id ? "bg-purple-50/80" : "hover:bg-purple-50/40"
                          }`}
                        >
                          {/* USER DETAILS CELL (NO CARD OPEN ON CLICK OR HOVER ON USER NAME) */}
                          <td
                            className="py-3.5 sm:py-4 px-4 pl-5 sm:pl-6 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setHoveredUserId(null);
                            }}
                          >
                            <div className="flex items-center gap-2.5 p-1 select-text">
                              <div className="w-9 h-9 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                                {user.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {user.name}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-500 mt-1.5 flex flex-col gap-0.5 font-medium select-text">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Clock className="w-3 h-3 text-purple-600 shrink-0" />
                                <span>{formatTimeOnTool(user.createdAt)}</span>
                              </div>
                              {user.createdAt && (
                                <div className="text-[10px] text-slate-400 pl-4.5">
                                  Created: {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Folders Column */}
                          <td className="py-3.5 sm:py-4 px-4 max-w-xs">
                            <UserFoldersCell folders={user.folders} />
                          </td>

                          {/* Scanners Created */}
                          <td className="py-3.5 sm:py-4 px-4">
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <QrCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>{user.qrsCount} QRs</span>
                            </div>
                          </td>

                          {/* Scan Counts */}
                          <td className="py-3.5 sm:py-4 px-4">
                            <div className="font-extrabold text-purple-700 font-mono text-sm">
                              {(user.totalScans ?? 0).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                              Total Scans
                            </div>
                          </td>

                          {/* Plan & Status */}
                          <td className="py-3.5 sm:py-4 px-4">
                            <div className="font-semibold text-slate-800 text-xs">
                              {user.planName}
                            </div>
                            <div className="mt-1">
                              <span
                                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  user.status === "ACTIVE"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </div>
                          </td>

                          {/* Action Buttons - Side by Side (Stops Row Click Propagation) */}
                          <td
                            className="py-3.5 sm:py-4 px-4 text-right pr-5 sm:pr-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-2 shrink-0 whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUserForPassword(user);
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold text-xs rounded-lg border border-slate-200 transition-all inline-flex items-center gap-1 shrink-0 shadow-2xs"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                                Reset Password
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleUserStatus(user.id);
                                }}
                                className={`px-3 py-1.5 font-semibold text-xs rounded-lg transition-all inline-flex items-center gap-1 shrink-0 ${
                                  user.status === "ACTIVE"
                                    ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {user.status === "ACTIVE" ? (
                                  <UserX className="w-3.5 h-3.5" />
                                ) : (
                                  <UserCheck className="w-3.5 h-3.5" />
                                )}
                                {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* FULL-WIDTH CARD EXPANSION ON HOVER */}
                        {hoveredUserId === user.id && (
                          <tr
                            key={`dropdown-${user.id}`}
                            onMouseEnter={() => setHoveredUserId(user.id)}
                            onMouseLeave={() => setHoveredUserId(null)}
                            onClick={() => setSelectedUserForCard(user)}
                            className="bg-purple-50/50 border-b border-purple-100 transition-all animate-in fade-in-50 duration-150 cursor-pointer"
                          >
                            <td colSpan={6} className="p-3 sm:p-4">
                              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-purple-100 space-y-4 w-full">
                                {/* Top Header Row of Full-Width Card */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-purple-600/20 shrink-0">
                                      {user.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-slate-900 text-sm">{user.name}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                                          {user.role}
                                        </span>
                                        <span
                                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            user.status === "ACTIVE"
                                              ? "bg-emerald-100 text-emerald-800"
                                              : "bg-rose-100 text-rose-800"
                                          }`}
                                        >
                                          {user.status}
                                        </span>
                                      </div>
                                      <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 text-xs text-purple-700 bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-100 font-semibold w-fit">
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                      <span>{formatTimeOnTool(user.createdAt)}</span>
                                    </div>
                                    {user.createdAt && (
                                      <span className="text-slate-500 font-normal text-[11px] sm:border-l sm:border-purple-200 sm:pl-2.5">
                                        Created: {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* 4-Box Metrics Grid Spanning Full Width */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                      <Folder className="w-3.5 h-3.5 text-slate-500" /> Folders
                                    </div>
                                    <div className="text-xl font-black text-slate-900 mt-0.5">
                                      {user.foldersCount ?? (user.folders?.length || 0)}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium">Organized folders</div>
                                  </div>

                                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                                    <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                                      <QrCode className="w-3.5 h-3.5 text-indigo-600" /> Scanners Created
                                    </div>
                                    <div className="text-xl font-black text-slate-900 mt-0.5">
                                      {user.qrsCount}
                                    </div>
                                    <div className="text-[10px] text-indigo-600 font-medium">QR codes created</div>
                                  </div>

                                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> Lifetime Scans
                                    </div>
                                    <div className="text-xl font-black text-emerald-950 mt-0.5">
                                      {(user.totalScans ?? 0).toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 font-medium">Total scans aggregated</div>
                                  </div>

                                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                                    <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-wider">
                                      <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Subscription Plan
                                    </div>
                                    <div className="text-base font-black text-amber-950 mt-0.5 truncate">
                                      {user.planName}
                                    </div>
                                    <div className="text-[10px] text-amber-700 font-medium">Current active tier</div>
                                  </div>
                                </div>

                                {/* Full Width Folders Breakdown List */}
                                <div className="pt-1">
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    User Folders ({user.folders?.length || 0})
                                  </div>
                                  {!user.folders || user.folders.length === 0 ? (
                                    <div className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 text-center">
                                      No folders created by this user yet
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                      {user.folders.map((f) => (
                                        <div
                                          key={f.id}
                                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-100/70 transition-colors"
                                        >
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="text-xs font-bold truncate text-slate-800">{f.name}</span>
                                          </div>
                                          <span className="text-[10px] font-extrabold text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200 shrink-0 ml-1">
                                            {f.qrCount} QRs
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="text-center pt-1 border-t border-purple-50 text-[11px] font-bold text-purple-600">
                                  Click anywhere on card or row to open full detailed account view
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center text-slate-400 font-medium text-xs sm:text-sm"
                        >
                          No user accounts match the selected duration or search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCAN HISTORY EXPORTS */}
        {activeTab === "exports" && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Export Scan Analytics</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate CSV reports of user QR code scan performance filtered by account and time frame.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Time Duration</label>
                  <select
                    value={exportTimeRange}
                    onChange={(e) => setExportTimeRange(e.target.value as ExportTimeRange)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="1m">Last 1 Month</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="12m">Last 12 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">User Account</label>
                  <select
                    value={exportSelectedUserId}
                    onChange={(e) => setExportSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="ALL">All Users ({users.length})</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Folder</label>
                  <select
                    value={exportSelectedFolder}
                    onChange={(e) => setExportSelectedFolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="ALL">All Folders</option>
                    {availableFolders.map((folderName) => (
                      <option key={folderName} value={folderName}>
                        {folderName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Found <strong>{filteredScanners.length}</strong> matching QR scanner records
                </span>
                <button
                  onClick={handleGenerateCSVExport}
                  disabled={isExporting || filteredScanners.length === 0}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? "Exporting CSV..." : "Export to CSV"}
                </button>
              </div>
            </div>

            {/* Scanner preview table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/60">
                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Report Preview ({filteredScanners.length} records)
                </h4>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-4">Scanner Name</th>
                      <th className="py-2.5 px-4">User</th>
                      <th className="py-2.5 px-4">Folder</th>
                      <th className="py-2.5 px-4 text-right">Scans ({exportTimeRange})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredScanners.slice(0, 15).map((scanner) => (
                      <tr key={scanner.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{scanner.name}</td>
                        <td className="py-2.5 px-4 text-slate-600">{scanner.userName}</td>
                        <td className="py-2.5 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
                            {scanner.folderName}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-extrabold text-purple-700">
                          {exportTimeRange === "1m"
                            ? scanner.scanCount1m
                            : exportTimeRange === "3m"
                            ? scanner.scanCount3m
                            : exportTimeRange === "6m"
                            ? scanner.scanCount6m
                            : scanner.scanCount12m}
                        </td>
                      </tr>
                    ))}
                    {filteredScanners.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          No records match selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPIRY ALERTS */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Expiration & Limit Warnings</h3>
              <p className="text-xs text-slate-500">
                Automated alerts triggered when user plans or QR scanner scan limits are near expiration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notifications.length === 0 ? (
                <div className="col-span-full p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                  No active expiration or limit alerts right now.
                </div>
              ) : (
                notifications.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Expiry Warning
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{item.userName}</div>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                      {item.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN SECURITY CREDENTIALS */}
        {activeTab === "security" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Change Admin Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your personal administrative login credentials.
              </p>
            </div>

            {securityMessage && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold border ${securityMessage.isError ? "bg-rose-50 text-rose-900 border-rose-200" : "bg-emerald-50 text-emerald-900 border-emerald-200"}`}>
                {securityMessage.text}
              </div>
            )}

            <form onSubmit={handleAdminPasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={adminCurrentPassword}
                  onChange={(e) => setAdminCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RESET USER PASSWORD DIALOG */}
        {selectedUserForPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in-50 duration-150">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                  Reset User Password
                </div>
                <button
                  onClick={() => setSelectedUserForPassword(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Set a new password for account{" "}
                <strong className="text-slate-800">
                  {selectedUserForPassword.name}
                </strong>{" "}
                ({selectedUserForPassword.email}).
              </p>

              <form onSubmit={handleUserPasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Account Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password..."
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserForPassword(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FULL USER DETAILS CARD MODAL */}
        {selectedUserForCard && (
          <FullUserCardModal
            user={selectedUserForCard}
            onClose={() => setSelectedUserForCard(null)}
            onResetPassword={(u) => {
              setSelectedUserForCard(null);
              setSelectedUserForPassword(u);
            }}
            onToggleStatus={(userId) => {
              handleToggleUserStatus(userId);
              setSelectedUserForCard((prev) =>
                prev && prev.id === userId
                  ? {
                      ...prev,
                      status:
                        prev.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE",
                    }
                  : prev
              );
            }}
          />
        )}

      </div>
    </div>
  );
}