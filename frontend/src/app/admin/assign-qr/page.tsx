/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  UserCheck,
  QrCode,
  Folder,
  BarChart2,
  Trash2,
  Edit,
  ExternalLink,
  Building2,
  XCircle,
  UserPlus,
  Clock,
  Shield,
  User,
  Layers,
  ArrowRightLeft,
  Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ==========================================
// TYPES & SCHEMAS
// ==========================================

export type PlatformRole = "Admin" | "User";

export interface MasterQRCode {
  id: string;
  title: string;
  type: "Dynamic" | "Static";
  targetUrl: string;
  scans: number;
  status: "Active" | "Paused";
  createdAt: string;
  assignedToUser?: {
    id: string;
    name: string;
    email: string;
    role: PlatformRole;
    avatar: string;
  };
  assignedWorkspaceId?: string;
  assignedFolderId?: string;
}

export interface FolderItem {
  id: string;
  name: string;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  folders: FolderItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  avatar: string;
  workspaces: WorkspaceItem[];
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

const qrEditSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  targetUrl: z.string().url("Please enter a valid URL"),
  status: z.enum(["Active", "Paused"]),
});

type QREditFormData = z.infer<typeof qrEditSchema>;

const assignUserSchema = z.object({
  qrId: z.string().min(1, "Please select a QR Code"),
  userId: z.string().min(1, "Please select a user"),
  workspaceId: z.string().min(1, "Select a Workspace"),
  folderId: z.string().min(1, "Select a Folder"),
});

type AssignUserFormData = z.infer<typeof assignUserSchema>;

// ==========================================
// MOCK DATA
// ==========================================

const INITIAL_USERS: UserProfile[] = [
  {
    id: "usr_101",
    name: "Eleanor Vance",
    email: "eleanor.vance@acme.corp",
    role: "User",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    workspaces: [
      {
        id: "ws_1",
        name: "Global Marketing Campaign",
        folders: [
          { id: "fld_1", name: "Q1 Product Launch" },
          { id: "fld_2", name: "Social Media Ads" },
        ],
      },
      {
        id: "ws_2",
        name: "Regional Store Fronts",
        folders: [{ id: "fld_3", name: "San Francisco Flagship" }],
      },
    ],
  },
  {
    id: "usr_102",
    name: "Marcus Sterling",
    email: "marcus.s@nexus.io",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    workspaces: [
      {
        id: "ws_3",
        name: "Personal Portfolio",
        folders: [{ id: "fld_4", name: "Business Cards" }],
      },
    ],
  },
  {
    id: "usr_103",
    name: "Sophia Martinez",
    email: "sophia.m@growth.co",
    role: "User",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    workspaces: [
      {
        id: "ws_4",
        name: "Growth Hacking",
        folders: [{ id: "fld_5", name: "Referral Campaigns" }],
      },
    ],
  },
];

const INITIAL_ALL_QRS: MasterQRCode[] = [
  {
    id: "qr_1001",
    title: "Tech Expo Promo Card",
    type: "Dynamic",
    targetUrl: "https://acme.corp/expo2026",
    scans: 1420,
    status: "Active",
    createdAt: "2026-01-15",
    assignedToUser: {
      id: "usr_101",
      name: "Eleanor Vance",
      email: "eleanor.vance@acme.corp",
      role: "User",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    assignedWorkspaceId: "ws_1",
    assignedFolderId: "fld_1",
  },
  {
    id: "qr_1002",
    title: "Product Spec Sheet PDF",
    type: "Static",
    targetUrl: "https://acme.corp/specs/v4.pdf",
    scans: 389,
    status: "Active",
    createdAt: "2026-02-10",
    assignedToUser: {
      id: "usr_101",
      name: "Eleanor Vance",
      email: "eleanor.vance@acme.corp",
      role: "User",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    assignedWorkspaceId: "ws_1",
    assignedFolderId: "fld_1",
  },
  {
    id: "qr_1003",
    title: "Instagram Bio Link",
    type: "Dynamic",
    targetUrl: "https://acme.corp/ig-bio",
    scans: 4890,
    status: "Active",
    createdAt: "2026-03-01",
    assignedToUser: {
      id: "usr_101",
      name: "Eleanor Vance",
      email: "eleanor.vance@acme.corp",
      role: "User",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    assignedWorkspaceId: "ws_1",
    assignedFolderId: "fld_2",
  },
  {
    id: "qr_1004",
    title: "Digital Business Card vCard",
    type: "Dynamic",
    targetUrl: "https://nexus.io/marcus",
    scans: 210,
    status: "Active",
    createdAt: "2026-05-10",
    assignedToUser: {
      id: "usr_102",
      name: "Marcus Sterling",
      email: "marcus.s@nexus.io",
      role: "Admin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    assignedWorkspaceId: "ws_3",
    assignedFolderId: "fld_4",
  },
  {
    id: "qr_pool_901",
    title: "Global Black Friday Sale Banner",
    type: "Dynamic",
    targetUrl: "https://acme.corp/promos/black-friday",
    scans: 120,
    status: "Active",
    createdAt: "2026-05-01",
  },
  {
    id: "qr_pool_902",
    title: "VIP Customer Lounge Wi-Fi",
    type: "Static",
    targetUrl: "https://acme.corp/wifi-access",
    scans: 450,
    status: "Active",
    createdAt: "2026-05-10",
  },
  {
    id: "qr_pool_903",
    title: "Annual Feedback Survey 2026",
    type: "Dynamic",
    targetUrl: "https://acme.corp/survey/2026",
    scans: 0,
    status: "Active",
    createdAt: "2026-06-15",
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log_1",
    action: "Assigned QR Code",
    details: "Assigned 'Tech Expo Promo Card' (qr_1001) to Eleanor Vance",
    performedBy: "Admin Sarah",
    timestamp: "2026-03-02 10:14 AM",
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AssignQRManagement() {
  const [users] = useState<UserProfile[]>(INITIAL_USERS);
  const [allQRs, setAllQRs] = useState<MasterQRCode[]>(INITIAL_ALL_QRS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Search and Filters
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [qrSearchTerm, setQrSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("All");

  // Modal States
  const [assignModalData, setAssignModalData] = useState<{
    qr?: MasterQRCode;
    user?: UserProfile;
  } | null>(null);
  const [editingQR, setEditingQR] = useState<MasterQRCode | null>(null);
  const [analyticsQR, setAnalyticsQR] = useState<MasterQRCode | null>(null);
  const [unassignConfirmQR, setUnassignConfirmQR] = useState<MasterQRCode | null>(null);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearchTerm, roleFilter]);

  // Filtered QR List
  const filteredQRs = useMemo(() => {
    return allQRs.filter((qr) => {
      const matchesSearch =
        qr.title.toLowerCase().includes(qrSearchTerm.toLowerCase()) ||
        qr.id.toLowerCase().includes(qrSearchTerm.toLowerCase()) ||
        qr.targetUrl.toLowerCase().includes(qrSearchTerm.toLowerCase());

      const matchesAssignment =
        assignmentFilter === "All"
          ? true
          : assignmentFilter === "Assigned"
          ? !!qr.assignedToUser
          : !qr.assignedToUser;

      const matchesUserSelection = selectedUserId
        ? qr.assignedToUser?.id === selectedUserId
        : true;

      return matchesSearch && matchesAssignment && matchesUserSelection;
    });
  }, [allQRs, qrSearchTerm, assignmentFilter, selectedUserId]);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const logAction = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      action,
      details,
      performedBy: "Admin User",
      timestamp: new Date().toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Assign/Reassign QR Handler
  const handleAssignQR = (data: AssignUserFormData) => {
    const targetUser = users.find((u) => u.id === data.userId);
    const targetQR = allQRs.find((q) => q.id === data.qrId);

    if (!targetUser || !targetQR) return;

    setAllQRs((prev) =>
      prev.map((qr) => {
        if (qr.id !== data.qrId) return qr;
        return {
          ...qr,
          assignedToUser: {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role,
            avatar: targetUser.avatar,
          },
          assignedWorkspaceId: data.workspaceId,
          assignedFolderId: data.folderId,
        };
      })
    );

    logAction(
      "Assigned QR Code",
      `Assigned '${targetQR.title}' (${targetQR.id}) to ${targetUser.name}`
    );
    setAssignModalData(null);
  };

  // Unassign Handler
  const handleUnassignQR = () => {
    if (!unassignConfirmQR) return;

    setAllQRs((prev) =>
      prev.map((qr) => {
        if (qr.id !== unassignConfirmQR.id) return qr;
        return {
          ...qr,
          assignedToUser: undefined,
          assignedWorkspaceId: undefined,
          assignedFolderId: undefined,
        };
      })
    );

    logAction("Unassigned QR Code", `Unassigned '${unassignConfirmQR.title}' from user`);
    setUnassignConfirmQR(null);
  };

  // Edit QR Details Handler
  const handleEditQR = (data: QREditFormData) => {
    if (!editingQR) return;

    setAllQRs((prev) =>
      prev.map((qr) => {
        if (qr.id !== editingQR.id) return qr;
        return { ...qr, title: data.title, targetUrl: data.targetUrl, status: data.status };
      })
    );

    logAction("Updated QR Details", `Updated details for '${data.title}'`);
    setEditingQR(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-purple-100 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-xl shadow-2xs">
                <QrCode className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">Assign QR Management</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Select or click "Assign QR" on any user on the left side to assign QR codes on the right.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border border-purple-200">
              Total Platform QRs: <strong>{allQRs.length}</strong>
            </span>
          </div>
        </header>

        {/* 2-COLUMN SPLIT MASTER-DETAIL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ==========================================
             LEFT SIDE: USERS LIST WITH ASSIGN BUTTON
             ========================================== */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-base">Users List</h2>
              {selectedUserId && (
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="text-xs text-purple-700 font-semibold hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition"
              />
            </div>

            {/* Role Filter Dropdown */}
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-purple-600" />
                <span>Role Filter:</span>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>

            {/* Scrollable User List Cards */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredUsers.map((user) => {
                const isSelected = user.id === selectedUserId;
                const assignedCount = allQRs.filter((q) => q.assignedToUser?.id === user.id).length;

                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(isSelected ? null : user.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-purple-50/80 border-purple-600 shadow-2xs"
                        : "bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-purple-100 flex-shrink-0"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-slate-900 text-xs truncate">{user.name}</h3>
                          {user.role === "Admin" ? (
                            <Shield className="w-3 h-3 text-purple-600 flex-shrink-0" />
                          ) : (
                            <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="text-[10px] text-purple-700 font-semibold">
                          {assignedCount} Assigned QRs
                        </span>
                      </div>
                    </div>

                    {/* RIGHT SIDE BUTTON IN USER CARD */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUserId(user.id);
                        setAssignModalData({ user });
                      }}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white rounded-lg font-semibold text-xs transition shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Assign QR
                    </button>
                  </div>
                );
              })}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                  <p className="text-xs">No users match criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* ==========================================
             RIGHT SIDE: MASTER QR CODES LIST (7 COLUMNS)
             ========================================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter & Search Header */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-700" />
                  <h2 className="font-bold text-slate-900 text-base">
                    {selectedUser ? `QR Codes assigned to ${selectedUser.name}` : "All Platform QR Codes List"}
                  </h2>
                </div>

                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Showing {filteredQRs.length} QRs
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />
                  <input
                    type="text"
                    placeholder="Search QR title or URL..."
                    value={qrSearchTerm}
                    onChange={(e) => setQrSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs text-slate-500">Status:</span>
                  <select
                    value={assignmentFilter}
                    onChange={(e) => setAssignmentFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="All">All QRs</option>
                    <option value="Assigned">Assigned Only</option>
                    <option value="Unassigned">Unassigned Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* QR Code Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredQRs.map((qr) => (
                <div
                  key={qr.id}
                  className="p-4 border border-slate-200 bg-white rounded-2xl hover:border-purple-300 shadow-2xs space-y-3 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-700">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-xs">{qr.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{qr.id}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          qr.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {qr.status}
                      </span>
                    </div>

                    <div className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-slate-600 truncate flex items-center justify-between">
                      <span className="truncate">{qr.targetUrl}</span>
                      <a
                        href={qr.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 hover:text-purple-800 ml-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      {qr.assignedToUser ? (
                        <div className="flex items-center justify-between bg-purple-50/50 p-2 rounded-xl border border-purple-100/80">
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={qr.assignedToUser.avatar}
                              alt={qr.assignedToUser.name}
                              className="w-6 h-6 rounded-full object-cover border border-purple-200"
                            />
                            <div className="truncate text-[11px]">
                              <p className="font-semibold text-slate-900 truncate">
                                {qr.assignedToUser.name}
                              </p>
                              <p className="text-[9px] text-purple-700 font-mono">Assigned</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setAssignModalData({ qr })}
                            className="text-[10px] text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 bg-white border border-purple-200 px-2 py-1 rounded-md transition"
                          >
                            <ArrowRightLeft className="w-3 h-3" /> Reassign
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                          <span className="text-[11px] font-medium text-amber-700">
                            Unassigned
                          </span>
                          <button
                            onClick={() => setAssignModalData({ qr })}
                            className="text-[10px] text-amber-800 font-semibold flex items-center gap-1 bg-white border border-amber-200 px-2 py-1 rounded-md hover:bg-amber-100 transition"
                          >
                            <UserPlus className="w-3 h-3" /> Assign User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>Scans: <strong className="text-slate-800">{qr.scans}</strong></span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAnalyticsQR(qr)}
                        className="p-1.5 hover:bg-purple-50 text-purple-700 rounded transition"
                        title="View Analytics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingQR(qr)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition"
                        title="Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {qr.assignedToUser && (
                        <button
                          onClick={() => setUnassignConfirmQR(qr)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded transition"
                          title="Unassign QR Code"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredQRs.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
                  <QrCode className="w-10 h-10 mx-auto mb-2 text-purple-300" />
                  <p className="text-xs font-semibold text-slate-700">No QR Codes Found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your search or filter options.</p>
                </div>
              )}
            </div>

            {/* Audit Log */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-700" />
                <h3 className="font-bold text-slate-900 text-sm">System Activity Log</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {activityLogs.map((log) => (
                  <div key={log.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-slate-800">{log.action}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{log.details}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                      <p className="text-purple-700 font-semibold text-[11px]">{log.performedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
           MODALS
           ========================================== */}

        {/* Assign Modal */}
        {assignModalData && (
          <AssignUserModal
            users={users}
            allQRs={allQRs}
            preSelectedQR={assignModalData.qr}
            preSelectedUser={assignModalData.user}
            onClose={() => setAssignModalData(null)}
            onAssign={handleAssignQR}
          />
        )}

        {/* Edit QR Details Modal */}
        {editingQR && (
          <EditQRModal
            editingQR={editingQR}
            onClose={() => setEditingQR(null)}
            onSave={handleEditQR}
          />
        )}

        {/* Unassign Confirm Modal */}
        {unassignConfirmQR && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-lg text-slate-900">Unassign QR Code</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to unassign <strong>"{unassignConfirmQR.title}"</strong> from{" "}
                <strong>{unassignConfirmQR.assignedToUser?.name}</strong>? It will return to the unassigned pool.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setUnassignConfirmQR(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnassignQR}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Unassign Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {analyticsQR && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-700" />
                  QR Analytics
                </h3>
                <button onClick={() => setAnalyticsQR(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <p className="text-[11px] text-slate-500 font-medium">Total Scans</p>
                  <p className="text-xl font-bold text-purple-700 mt-0.5">{analyticsQR.scans}</p>
                </div>
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <p className="text-[11px] text-slate-500 font-medium">Status</p>
                  <p className="text-xl font-bold text-emerald-600 mt-0.5">{analyticsQR.status}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>QR Title:</span>
                  <span className="font-semibold text-slate-800">{analyticsQR.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Assigned User:</span>
                  <span className="font-semibold text-purple-700">
                    {analyticsQR.assignedToUser ? analyticsQR.assignedToUser.name : "None (Unassigned)"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setAnalyticsQR(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition mt-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODAL SUB-COMPONENTS
// ==========================================

function AssignUserModal({
  users,
  allQRs,
  preSelectedQR,
  preSelectedUser,
  onClose,
  onAssign,
}: {
  users: UserProfile[];
  allQRs: MasterQRCode[];
  preSelectedQR?: MasterQRCode;
  preSelectedUser?: UserProfile;
  onClose: () => void;
  onAssign: (data: AssignUserFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AssignUserFormData>({
    resolver: zodResolver(assignUserSchema),
    defaultValues: {
      qrId: preSelectedQR?.id || allQRs[0]?.id || "",
      userId: preSelectedUser?.id || users[0]?.id || "",
      workspaceId: (preSelectedUser || users[0])?.workspaces[0]?.id || "",
      folderId: (preSelectedUser || users[0])?.workspaces[0]?.folders[0]?.id || "",
    },
  });

  const selectedUserId = watch("userId");
  const selectedWorkspaceId = watch("workspaceId");

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || users[0],
    [users, selectedUserId]
  );

  const availableFolders = useMemo(() => {
    const ws = selectedUser?.workspaces.find((w) => w.id === selectedWorkspaceId);
    return ws ? ws.folders : [];
  }, [selectedUser, selectedWorkspaceId]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            Assign QR Code
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onAssign)} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select QR Code</label>
            <select
              {...register("qrId")}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            >
              {allQRs.map((qr) => (
                <option key={qr.id} value={qr.id}>
                  {qr.title} ({qr.type})
                </option>
              ))}
            </select>
            {errors.qrId && <p className="text-red-500 text-[11px] mt-1">{errors.qrId.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign To User</label>
            <select
              {...register("userId")}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            {errors.userId && <p className="text-red-500 text-[11px] mt-1">{errors.userId.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Workspace</label>
            <select
              {...register("workspaceId")}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            >
              {selectedUser?.workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Folder</label>
            <select
              {...register("folderId")}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            >
              {availableFolders.map((fld) => (
                <option key={fld.id} value={fld.id}>
                  {fld.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-700 to-purple-600 text-white hover:from-purple-800 hover:to-purple-700 transition"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditQRModal({
  editingQR,
  onClose,
  onSave,
}: {
  editingQR: MasterQRCode;
  onClose: () => void;
  onSave: (data: QREditFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QREditFormData>({
    resolver: zodResolver(qrEditSchema),
    defaultValues: {
      title: editingQR.title,
      targetUrl: editingQR.targetUrl,
      status: editingQR.status,
    },
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Edit QR Details</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">QR Title</label>
            <input
              {...register("title")}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            />
            {errors.title && <p className="text-red-500 text-[11px] mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target URL</label>
            <input
              {...register("targetUrl")}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            />
            {errors.targetUrl && <p className="text-red-500 text-[11px] mt-1">{errors.targetUrl.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-700 to-purple-600 text-white transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}