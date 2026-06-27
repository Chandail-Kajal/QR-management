/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { QRDTO } from "@/types";

import {
  Globe,
  Users,
  PlayCircle,
  AtSign,
  Share2,
  Star,
  FileText,
  QrCode,
  Link2,
  Type,
  Mail,
  Phone,
  Wifi,
  ContactRound,
  MessageCircle,
  BarChart3,
  CalendarDays,
  Music2,
} from "lucide-react";
import { QRStatusBadge } from "./qr-status-badge";
import { QRActionsDropdown } from "./qr-action-dropdown";
import { CiBoxList } from "react-icons/ci";

// ─── Token colours matched to dashboard accent palette ────────────────────────
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  URL:           { bg: "#1e2147", text: "#818cf8" },
  TEXT:          { bg: "#1e1b3a", text: "#a78bfa" },
  EMAIL:         { bg: "#0f2d2a", text: "#34d399" },
  PHONE:         { bg: "#1a2e18", text: "#4ade80" },
  SMS:           { bg: "#2a2210", text: "#fbbf24" },
  WHATSAPP:      { bg: "#0f2d20", text: "#22c55e" },
  WIFI:          { bg: "#1a1e42", text: "#6366f1" },
  VCARD:         { bg: "#2a1f0e", text: "#fb923c" },
  FILE:          { bg: "#1e2030", text: "#94a3b8" },
  GOOGLE_REVIEW: { bg: "#2a1610", text: "#f97316" },
  INSTAGRAM:     { bg: "#2a1020", text: "#f472b6" },
  FACEBOOK:      { bg: "#101e38", text: "#60a5fa" },
  LINKEDIN:      { bg: "#0e1e30", text: "#38bdf8" },
  X:             { bg: "#1a1c24", text: "#e2e8f0" },
  YOUTUBE:       { bg: "#280e0e", text: "#f87171" },
  TIKTOK:        { bg: "#220e2a", text: "#e879f9" },
  SOCIAL:        { bg: "#1a1e42", text: "#818cf8" },
};

function getTypeColors(type: string) {
  return TYPE_COLORS[type] ?? { bg: "#1a1e42", text: "#818cf8" };
}

function getTypeIcon(type: string) {
  switch (type) {
    case "URL":           return <Link2         className="h-4 w-4" />;
    case "TEXT":          return <Type          className="h-4 w-4" />;
    case "EMAIL":         return <Mail          className="h-4 w-4" />;
    case "PHONE":         return <Phone         className="h-4 w-4" />;
    case "SMS":
    case "WHATSAPP":      return <MessageCircle className="h-4 w-4" />;
    case "WIFI":          return <Wifi          className="h-4 w-4" />;
    case "VCARD":         return <ContactRound  className="h-4 w-4" />;
    case "FILE":          return <FileText      className="h-4 w-4" />;
    case "GOOGLE_REVIEW": return <Star          className="h-4 w-4" />;
    case "INSTAGRAM":
    case "X":             return <AtSign        className="h-4 w-4" />;
    case "FACEBOOK":      return <Users         className="h-4 w-4" />;
    case "LINKEDIN":      return <Share2        className="h-4 w-4" />;
    case "YOUTUBE":       return <PlayCircle    className="h-4 w-4" />;
    case "TIKTOK":        return <Music2        className="h-4 w-4" />;
    case "SOCIAL":        return <Globe         className="h-4 w-4" />;
    default:              return <QrCode        className="h-4 w-4" />;
  }
}

function getContentPreview(qr: QRDTO) {
  const content = qr.content as any;
  if (!content) return "-";
  switch (qr.type) {
    case "URL":           return content.url;
    case "TEXT":          return content.text;
    case "EMAIL":         return content.email;
    case "PHONE":         return content.phone;
    case "SMS":           return content.message || content.phone;
    case "WIFI":          return `SSID: ${content.ssid}`;
    case "VCARD":         return `${content.firstName ?? ""} ${content.lastName ?? ""}`.trim();
    case "WHATSAPP":      return content.phone;
    case "FILE":          return content.fileName;
    case "GOOGLE_REVIEW": return content.reviewUrl;
    case "INSTAGRAM":
    case "FACEBOOK":
    case "LINKEDIN":
    case "X":
    case "YOUTUBE":
    case "TIKTOK":        return content.url;
    case "SOCIAL":        return content.title || "Social Links";
    default:              return "-";
  }
}

export function QRTable({
  items,
  onDelete,
  onEdit,
}: {
  items: QRDTO[];
  onEdit: (qr: QRDTO) => void;
  onDelete: (id: string | number) => void;
}) {
  // ── Empty state ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        className="relative overflow-hidden rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[280px] group transition-all duration-200"
        style={{
          background: "#161b35",
          border: "1px solid #232848",
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-transform duration-200 group-hover:scale-105"
          style={{ background: "#1e2147", color: "#6366f1", border: "1px solid #2d3260" }}
        >
          <QrCode className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-semibold tracking-tight mb-1.5" style={{ color: "#e2e8f0" }}>
          No codes generated yet
        </h3>
        <p className="text-xs max-w-[240px] leading-relaxed" style={{ color: "#4a5280" }}>
          Create your first QR code to start tracking scans and analytics.
        </p>
      </div>
    );
  }

  // ── Table ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        background: "#161b35",
        border: "1px solid #232848",
      }}
    >
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow
            className="hover:bg-transparent"
            style={{ borderBottom: "1px solid #1e2448", background: "#131628" }}
          >
            <TableHead
              className="h-11 pl-5"
              style={{ color: "#6b7db3", fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}
            >
              <span className="flex items-center gap-1.5">
                <CiBoxList className="h-3.5 w-3.5" style={{ color: "#6366f1" }} />
                QR Details
              </span>
            </TableHead>

            <TableHead
              className="h-11"
              style={{ color: "#6b7db3", fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}
            >
              Status
            </TableHead>

            <TableHead
              className="h-11"
              style={{ color: "#6b7db3", fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" style={{ color: "#6366f1" }} />
                Scans
              </span>
            </TableHead>

            <TableHead
              className="h-11"
              style={{ color: "#6b7db3", fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}
            >
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" style={{ color: "#6366f1" }} />
                Created
              </span>
            </TableHead>

            <TableHead className="w-14 pr-5 h-11" />
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {items.map((qr) => {
            const { bg, text } = getTypeColors(qr.type);
            return (
              <TableRow
                key={qr.id}
                className="group transition-colors duration-150 cursor-default"
                style={{ borderBottom: "1px solid #1a1f3d" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1a1f3d";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {/* Details */}
                <TableCell className="py-4 pl-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: bg, color: text }}
                      >
                        {getTypeIcon(qr.type)}
                      </div>
                      <div>
                        <p
                          className="font-semibold text-sm tracking-tight"
                          style={{ color: "#ffffff" }}
                        >
                          {qr.name}
                        </p>
                        <p
                          className="text-[10px] uppercase tracking-wider mt-0.5"
                          style={{ color: "#6b7db3" }}
                        >
                          {qr.type.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>

                    <p className="max-w-[350px] truncate text-xs" style={{ color: "#8896c8" }}>
                      {getContentPreview(qr)}
                    </p>

                    {/* token chip */}
                    <div
                      className="inline-flex w-fit rounded-md px-2 py-0.5"
                      style={{ background: "#1e2147", border: "1px solid #2d3260" }}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#6366f1" }}>
                        {qr.token}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-4">
                  <div className="inline-flex">
                    <QRStatusBadge status={qr.status} />
                  </div>
                </TableCell>

                {/* Scans */}
                <TableCell className="py-4 text-sm font-bold font-mono" style={{ color: "#4ade80" }}>
                  {qr.scanCount.toLocaleString()}
                </TableCell>

                {/* Created */}
                <TableCell className="py-4 text-xs font-semibold" style={{ color: "#c7d2fe" }}>
                  {new Date(qr.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>

                {/* Actions */}
                <TableCell className="py-4 pr-5 text-right">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <QRActionsDropdown qr={qr} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
