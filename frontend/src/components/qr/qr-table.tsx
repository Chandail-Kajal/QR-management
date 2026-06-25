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

function getTypeIcon(type: string) {
  switch (type) {
    case "URL":
      return <Link2 className="h-4 w-4" />;

    case "TEXT":
      return <Type className="h-4 w-4" />;

    case "EMAIL":
      return <Mail className="h-4 w-4" />;

    case "PHONE":
      return <Phone className="h-4 w-4" />;

    case "SMS":
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4" />;

    case "WIFI":
      return <Wifi className="h-4 w-4" />;

    case "VCARD":
      return <ContactRound className="h-4 w-4" />;

    case "FILE":
      return <FileText className="h-4 w-4" />;

    case "GOOGLE_REVIEW":
      return <Star className="h-4 w-4" />;

    case "INSTAGRAM":
      return <AtSign className="h-4 w-4" />;

    case "FACEBOOK":
      return <Users className="h-4 w-4" />;

    case "LINKEDIN":
      return <Share2 className="h-4 w-4" />;

    case "X":
      return <AtSign className="h-4 w-4" />;

    case "YOUTUBE":
      return <PlayCircle className="h-4 w-4" />;

    case "TIKTOK":
      return <Music2 className="h-4 w-4" />;

    case "SOCIAL":
      return <Globe className="h-4 w-4" />;

    default:
      return <QrCode className="h-4 w-4" />;
  }
}
function getContentPreview(qr: QRDTO) {
  const content = qr.content as any;

  if (!content) return "-";

  switch (qr.type) {
    case "URL":
      return content.url;

    case "TEXT":
      return content.text;

    case "EMAIL":
      return content.email;

    case "PHONE":
      return content.phone;

    case "SMS":
      return content.message || content.phone;

    case "WIFI":
      return `SSID: ${content.ssid}`;

    case "VCARD":
      return `${content.firstName ?? ""} ${
        content.lastName ?? ""
      }`.trim();

    case "WHATSAPP":
      return content.phone;

    case "FILE":
      return content.fileName;

    case "GOOGLE_REVIEW":
      return content.reviewUrl;

    case "INSTAGRAM":
    case "FACEBOOK":
    case "LINKEDIN":
    case "X":
    case "YOUTUBE":
    case "TIKTOK":
      return content.url;

    case "SOCIAL":
      return content.title || "Social Links";

    default:
      return "-";
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
  if (items.length === 0) {
    return (
      <div className="relative overflow-hidden border border-border/40 rounded-2xl bg-card/20 backdrop-blur-md p-12 text-center shadow-2xl shadow-black/40 flex flex-col items-center justify-center min-h-[280px] group transition-all duration-300">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
          <QrCode className="h-6 w-6 stroke-[1.5]" />
        </div>

        <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1">
          No codes generated yet
        </h3>

        <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
          Create your first QR code to start tracking scans and analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border/40 rounded-2xl bg-card/20 backdrop-blur-md shadow-2xl shadow-black/50 transition-all duration-300">
      <Table>
        <TableHeader className="bg-muted/30 border-b border-border/40">
          <TableRow className="hover:bg-transparent border-b border-border/30">
            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 pl-5">
              <span className="flex items-center gap-1.5">
                <CiBoxList className="h-3.5 w-3.5 text-primary" />
                QR Details
              </span>
            </TableHead>

            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Status
            </TableHead>

            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary/80" />
                Scans
              </span>
            </TableHead>

            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary/80" />
                Created
              </span>
            </TableHead>

            <TableHead className="w-14 pr-5 h-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((qr) => (
            <TableRow
              key={qr.id}
              className="border-b border-border/20 last:border-b-0 hover:bg-primary/[0.03] transition-colors duration-150 group"
            >
              <TableCell className="py-4 pl-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {getTypeIcon(qr.type)}
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors duration-150">
                        {qr.name}
                      </p>

                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {qr.type.replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>

                  <p className="max-w-[350px] truncate text-xs text-muted-foreground">
                    {getContentPreview(qr)}
                  </p>

                  <div className="inline-flex w-fit rounded-md border border-primary/20 bg-primary/10 px-2 py-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                      {qr.token}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="inline-flex scale-95 origin-left">
                  <QRStatusBadge status={qr.status} />
                </div>
              </TableCell>

              <TableCell className="py-4 text-sm font-medium text-foreground/80 font-mono">
                {qr.scanCount.toLocaleString()}
              </TableCell>

              <TableCell className="py-4 text-xs font-medium text-muted-foreground/80">
                {new Date(qr.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>

              <TableCell className="py-4 pr-5 text-right">
                <div className="flex justify-end opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                  <QRActionsDropdown
                    qr={qr}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

