"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";

// --- TYPES ---
type ExportTimeRange = "1m" | "3m" | "6m" | "12m";

interface SystemNotification {
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

interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "DEACTIVATED";
  planName: string;
  subscriptionId: number | null;
  qrsCount: number;
}

interface QRScannerRecord {
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

// --- MOCK DATA ---
const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 101,
    userId: 3,
    userName: "Sarah Jenkins",
    userEmail: "sarah.j@growthlabs.com",
    type: "SUBSCRIPTION_EXPIRING",
    message: "3-Month Pro subscription expires in 3 days.",
    daysRemaining: 3,
    subscriptionId: 301,
    createdAt: "2026-07-20T08:00:00Z",
  },
  {
    id: 102,
    userId: 6,
    userName: "Liam O'Connor",
    userEmail: "liam@bistro99.ie",
    type: "SCAN_LIMIT_REACHED",
    message: "QR code 'Summer Menu' has reached 95% of scan limit (1,850 / 2,000 scans).",
    scansLeft: 150,
    createdAt: "2026-07-19T14:30:00Z",
  },
];

const INITIAL_USERS: ManagedUser[] = [
  { id: 1, name: "Alex Morgan", email: "alex.morgan@techcorp.io", role: "USER", status: "ACTIVE", planName: "Yearly Enterprise", subscriptionId: 201, qrsCount: 142 },
  { id: 2, name: "Devon Chen", email: "devon@designstudio.co", role: "USER", status: "ACTIVE", planName: "Monthly Pro", subscriptionId: 202, qrsCount: 28 },
  { id: 3, name: "Sarah Jenkins", email: "sarah.j@growthlabs.com", role: "ADMIN", status: "ACTIVE", planName: "3-Month Pro", subscriptionId: 301, qrsCount: 45 },
  { id: 4, name: "Marcus Vance", email: "m.vance@retailhub.net", role: "USER", status: "ACTIVE", planName: "Free Trial", subscriptionId: null, qrsCount: 3 },
  { id: 5, name: "Liam O'Connor", email: "liam@bistro99.ie", role: "USER", status: "DEACTIVATED", planName: "Monthly Pro", subscriptionId: 205, qrsCount: 18 },
];

const MOCK_SCANNERS: QRScannerRecord[] = [
  { id: 501, name: "Summer Campaign URL", userId: 1, userName: "Alex Morgan", folderName: "Marketing 2026", scanCount1m: 1420, scanCount3m: 4800, scanCount6m: 9200, scanCount12m: 18400, createdAt: "2025-08-10" },
  { id: 502, name: "Corporate vCard", userId: 1, userName: "Alex Morgan", folderName: "Sales Team", scanCount1m: 310, scanCount3m: 980, scanCount6m: 2100, scanCount12m: 4500, createdAt: "2025-09-01" },
  { id: 503, name: "Restaurant Menu PDF", userId: 2, userName: "Devon Chen", folderName: "Table QR Codes", scanCount1m: 890, scanCount3m: 2400, scanCount6m: 4100, scanCount12m: 7800, createdAt: "2025-11-15" },
  { id: 504, name: "Feedback Google Review", userId: 3, userName: "Sarah Jenkins", folderName: "Customer Loyalty", scanCount1m: 540, scanCount3m: 1600, scanCount6m: 3200, scanCount12m: 5900, createdAt: "2026-01-20" },
  { id: 505, name: "WiFi Guest Access", userId: 4, userName: "Marcus Vance", folderName: "Office Guests", scanCount1m: 45, scanCount3m: 120, scanCount6m: 210, scanCount12m: 340, createdAt: "2026-05-10" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "exports" | "alerts" | "security">("exports");

  // Admin Credentials State
  const [adminCurrentPassword, setAdminCurrentPassword] = useState("");
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // User Management State
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<ManagedUser | null>(null);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [userActionMessage, setUserActionMessage] = useState<string | null>(null);

  // System Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // --- EXPORT STATE ---
  const [exportTimeRange, setExportTimeRange] = useState<ExportTimeRange>("3m");
  const [exportSelectedUserId, setExportSelectedUserId] = useState<string>("ALL");
  const [exportSelectedFolder, setExportSelectedFolder] = useState<string>("ALL");
  const [isExporting, setIsExporting] = useState(false);

  // Available unique folders from scanners
  const availableFolders = useMemo(() => {
    return Array.from(new Set(MOCK_SCANNERS.map((s) => s.folderName)));
  }, []);

  // Filtered Scanners for Preview Table
  const filteredScanners = useMemo(() => {
    return MOCK_SCANNERS.filter((scanner) => {
      const matchesUser = exportSelectedUserId === "ALL" || scanner.userId === Number(exportSelectedUserId);
      const matchesFolder = exportSelectedFolder === "ALL" || scanner.folderName === exportSelectedFolder;
      return matchesUser && matchesFolder;
    });
  }, [exportSelectedUserId, exportSelectedFolder]);

  // CSV EXPORT GENERATOR
  const handleGenerateCSVExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      // Build CSV Content
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

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
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
  const handleAdminPasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCurrentPassword || !adminNewPassword || !adminConfirmPassword) {
      setSecurityMessage({ text: "Please fill in all password fields.", isError: true });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setSecurityMessage({ text: "New passwords do not match.", isError: true });
      return;
    }
    setSecurityMessage({ text: "Admin password updated successfully!", isError: false });
    setAdminCurrentPassword("");
    setAdminNewPassword("");
    setAdminConfirmPassword("");
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 p-6 rounded-2xl text-white shadow-xl shadow-purple-900/10">
          <div>
            <span className="text-purple-200 text-xs font-semibold uppercase tracking-wider bg-purple-900/50 px-2.5 py-1 rounded-full border border-purple-400/30">
              Admin Control Center
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">
              Settings & Scan Analytics Exports
            </h1>
            <p className="text-purple-100 text-sm mt-1 opacity-90">
              Export user scan history, manage passwords, and configure platform settings.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-purple-900/40 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-400/20 text-xs text-purple-100">
            <Bell className="w-4 h-4 text-purple-300" />
            <span>Pending Alerts: <strong>{notifications.length}</strong></span>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {userActionMessage && (
          <div className="p-4 bg-purple-100 border border-purple-200 text-purple-900 text-sm rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-purple-700" />
              {userActionMessage}
            </div>
            <button onClick={() => setUserActionMessage(null)} className="text-purple-700 hover:text-purple-900">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-fit gap-1">
          <button
            onClick={() => setActiveTab("exports")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "exports"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Scan History Exports
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <User className="w-4 h-4" />
            User Accounts
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "security"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <Lock className="w-4 h-4" />
            Admin Credentials
          </button>
        </div>

        {/* TAB 1: SCAN HISTORY EXPORTS */}
        {activeTab === "exports" && (
          <div className="space-y-6">
            
            {/* EXPORT CONTROL PANEL */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Export QR Scanner & Folder Analytics
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Filter scan records by time duration (1 to 12 months), specific user accounts, or folder categories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Duration Window Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    Time Window Duration
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    {(
                      [
                        { id: "1m", label: "1 Mo" },
                        { id: "3m", label: "3 Mos" },
                        { id: "6m", label: "6 Mos" },
                        { id: "12m", label: "12 Mos" },
                      ] as const
                    ).map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setExportTimeRange(range.id)}
                        className={`py-2 rounded-lg text-center transition-all ${
                          exportTimeRange === range.id
                            ? "bg-purple-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-purple-700"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Specific User */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    Filter by User Account
                  </label>
                  <select
                    value={exportSelectedUserId}
                    onChange={(e) => setExportSelectedUserId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="ALL">All Platform Users</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Folder */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-purple-600" />
                    Filter by Folder
                  </label>
                  <select
                    value={exportSelectedFolder}
                    onChange={(e) => setExportSelectedFolder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="ALL">All Folders</option>
                    {availableFolders.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Matches <strong>{filteredScanners.length}</strong> QR Scanner codes for export
                </span>

                <button
                  onClick={handleGenerateCSVExport}
                  disabled={isExporting || filteredScanners.length === 0}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? "Generating CSV..." : `Export ${exportTimeRange.toUpperCase()} Scan Report (CSV)`}
                </button>
              </div>
            </div>

            {/* PREVIEW TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-purple-900 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Scan History Preview ({exportTimeRange.toUpperCase()} Window)</span>
                <span>{filteredScanners.length} Records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4 pl-6">QR Scanner Name</th>
                      <th className="py-3 px-4">User Account</th>
                      <th className="py-3 px-4">Folder</th>
                      <th className="py-3 px-4">Scans ({exportTimeRange.toUpperCase()})</th>
                      <th className="py-3 px-4 pr-6">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredScanners.map((scanner) => {
                      let scans = scanner.scanCount3m;
                      if (exportTimeRange === "1m") scans = scanner.scanCount1m;
                      if (exportTimeRange === "6m") scans = scanner.scanCount6m;
                      if (exportTimeRange === "12m") scans = scanner.scanCount12m;

                      return (
                        <tr key={scanner.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-3.5 px-4 pl-6 font-semibold text-slate-900 flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-purple-600" />
                            {scanner.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">{scanner.userName}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium">
                              <Folder className="w-3 h-3 text-slate-400" />
                              {scanner.folderName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-purple-800">
                            {scans.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 pr-6">{scanner.createdAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search accounts by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-purple-900 text-white text-xs font-semibold uppercase tracking-wider">
                      <th className="py-4 px-4 pl-6">User Account</th>
                      <th className="py-4 px-4">Role</th>
                      <th className="py-4 px-4">Plan</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right pr-6">Account Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-4 px-4 pl-6">
                          <div className="font-semibold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                            {user.role}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-medium text-slate-800">{user.planName}</td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              user.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right pr-6 space-x-2">
                          <button
                            onClick={() => setSelectedUserForPassword(user)}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs rounded-lg border border-purple-200 transition-all inline-flex items-center gap-1"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            Reset Password
                          </button>

                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`px-3 py-1.5 font-semibold text-xs rounded-lg transition-all inline-flex items-center gap-1 ${
                              user.status === "ACTIVE"
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {user.status === "ACTIVE" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPIRY ALERTS */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">Expiration & Limit Warnings</h3>
              <p className="text-xs text-slate-500">
                Automated alerts triggered when user plans or QR scanner scan limits are near expiration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notifications.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-3">
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
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN SECURITY CREDENTIALS */}
        {activeTab === "security" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Change Admin Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your personal administrative login credentials.
              </p>
            </div>

            {securityMessage && (
              <div className="p-3.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200">
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

      </div>
    </div>
  );
}