"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Search, Filter } from "lucide-react";
import { QRStatus } from "@/types";

interface QRToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status?: QRStatus;
  onStatusChange: (value?: QRStatus) => void;
  onCreate?: () => void;
}

export function QRToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreate,
}: QRToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-1">
      {/* Search + Filter */}
      <div className="flex flex-1 flex-col sm:flex-row gap-2.5">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none"
            style={{ color: "#6b7db3" }}
          />
          <Input
            placeholder="Search by name or token..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-lg border text-sm placeholder:text-[#6b7db3] transition-all duration-150 focus-visible:ring-0 focus-visible:outline-none"
            style={{
              background: "#161b35",
              borderColor: "#232848",
              color: "#ffffff",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "#232848"; }}
          />
        </div>

        {/* Status select */}
        <Select
          value={status ?? "ALL"}
          onValueChange={(value) =>
            onStatusChange(value === "ALL" ? undefined : (value as QRStatus))
          }
        >
          <SelectTrigger
            className="w-full sm:w-40 h-10 rounded-lg border text-sm gap-2 transition-all duration-150 focus:ring-0 focus:outline-none"
            style={{
              background: "#161b35",
              borderColor: "#232848",
              color: "#c7d2fe",
            }}
          >
            <Filter className="h-3.5 w-3.5 shrink-0" style={{ color: "#6366f1" }} />
            <div className="flex-1 text-left truncate">
              <SelectValue placeholder="All statuses" />
            </div>
          </SelectTrigger>

          <SelectContent
            className="p-1 border rounded-xl"
            style={{
              background: "#131628",
              borderColor: "#232848",
              boxShadow: "0 16px 40px rgba(0,0,0,0.60)",
            }}
          >
            {[
              { value: "ALL",      label: "All statuses" },
              { value: "ACTIVE",   label: "Active"       },
              { value: "PAUSED",   label: "Paused"       },
              { value: "ARCHIVED", label: "Archived"     },
            ].map(({ value, label }) => (
              <SelectItem
                key={value}
                value={value}
                className="rounded-lg cursor-pointer py-2 text-sm transition-colors duration-100 focus:bg-[#1e2147] focus:text-indigo-400"
                style={{ color: "#c7d2fe" }}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Create CTA */}
      <Button
        onClick={onCreate}
        className="h-10 rounded-lg text-sm font-semibold px-5 flex items-center gap-2 border-0 transition-all duration-150 active:scale-95 hover:opacity-90"
        style={{
          background: "#5b5ef4",
          color: "#ffffff",
          boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
        }}
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        <span>Create QR</span>
      </Button>
    </div>
  );
}
