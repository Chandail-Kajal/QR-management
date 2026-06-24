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
import { QrCode, BarChart3, CalendarDays, Sparkles } from "lucide-react";

import { QRStatusBadge } from "./qr-status-badge";
import { QRActionsDropdown } from "./qr-action-dropdown";

export function QRTable({
  items,
  onDelete,
  onEdit,
}: {
  items: QRDTO[];
  onEdit: (qr: QRDTO) => void;
  onDelete: (id: string | number) => void;
}) {
  // Empty State: Deep Obsidian Canvas with a Pastel Purple Glow
  if (items.length === 0) {
    return (
      <div className="relative overflow-hidden border border-border/40 rounded-2xl bg-card/20 backdrop-blur-md p-12 text-center shadow-2xl shadow-black/40 flex flex-col items-center justify-center min-h-[280px] group transition-all duration-300">
        {/* Subtle Orchid back-glow */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
        
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
          <QrCode className="h-6 w-6 stroke-[1.5]" />
        </div>
        
        <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1 flex items-center gap-1.5">
          <span>No codes generated yet</span>
        </h3>
        <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
          Create your very first dynamic link to display aesthetic analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border/40 rounded-2xl bg-card/20 backdrop-blur-md shadow-2xl shadow-black/50 transition-all duration-300">
      <Table>
        {/* Header styling with deep background shading */}
        <TableHeader className="bg-muted/30 border-b border-border/40">
          <TableRow className="hover:bg-transparent border-b border-border/30">
            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 pl-5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Name & Details
              </span>
            </TableHead>
            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Status</TableHead>
            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary/80" /> Scans
              </span>
            </TableHead>
            <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary/80" /> Created
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
              {/* Title & Micro-Token Badge */}
              <TableCell className="py-4 pl-5">
                <div className="flex flex-col items-start gap-1">
                  <p className="font-semibold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors duration-150">
                    {qr.name}
                  </p>
                  <p className="text-[10px] font-mono tracking-wider uppercase text-primary bg-primary/10 border border-primary/20 rounded-md px-1.5 py-0.5 shadow-sm">
                    {qr.token}
                  </p>
                </div>
              </TableCell>

              {/* Status Section */}
              <TableCell className="py-4">
                <div className="inline-flex scale-95 origin-left select-none">
                  <QRStatusBadge status={qr.status} />
                </div>
              </TableCell>

              {/* Scan Metrics */}
              <TableCell className="py-4 text-sm font-medium text-foreground/80 tracking-tight font-mono">
                {qr.scanCount.toLocaleString()}
              </TableCell>

              {/* Created Date */}
              <TableCell className="py-4 text-xs font-medium text-muted-foreground/80 tracking-wide">
                {new Date(qr.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>

              {/* Actions Interaction Trigger */}
              <TableCell className="py-4 pr-5 text-right">
                <div className="flex justify-end opacity-40 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                  <QRActionsDropdown
                    onDelete={onDelete}
                    onEdit={onEdit}
                    qr={qr}
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