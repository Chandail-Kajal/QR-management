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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-1 bg-transparent">
      {/* Search and Filters Compound Group */}
      <div className="flex flex-1 flex-col sm:flex-row gap-3">
        {/* Aesthetic Interactive Search Wrapper */}
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors duration-200 group-focus-within:text-primary" />
          <Input
            placeholder="Search by name or token..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-card/40 border-border/60 hover:border-border/90 focus-visible:ring-primary/40 focus-visible:border-primary rounded-xl transition-all duration-200"
          />
        </div>

        {/* Custom Glassmorphism Status Select Selector */}
        <Select
          value={status ?? "ALL"}
          onValueChange={(value) =>
            onStatusChange(value === "ALL" ? undefined : (value as QRStatus))
          }
        >
          <SelectTrigger className="w-full sm:w-[180px] h-10 bg-card/40 border-border/60 hover:border-border/90 focus:ring-primary/40 rounded-xl flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200">
            <Filter className="h-3.5 w-3.5 text-muted-foreground/60" />
            <div className="flex-1 text-left truncate">
              <SelectValue placeholder="All statuses" />
            </div>
          </SelectTrigger>

          <SelectContent className="p-1 border-border/60 bg-card/95 backdrop-blur-md shadow-xl rounded-2xl animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <SelectItem value="ALL" className="rounded-xl cursor-pointer py-2 focus:bg-primary/10 focus:text-primary">
              All statuses
            </SelectItem>
            <SelectItem value="ACTIVE" className="rounded-xl cursor-pointer py-2 focus:bg-primary/10 focus:text-primary">
              Active
            </SelectItem>
            <SelectItem value="PAUSED" className="rounded-xl cursor-pointer py-2 focus:bg-primary/10 focus:text-primary">
              Paused
            </SelectItem>
            <SelectItem value="ARCHIVED" className="rounded-xl cursor-pointer py-2 focus:bg-primary/10 focus:text-primary">
              Archived
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Primary Orchid CTA Button */}
      <Button 
        onClick={onCreate}
        className="h-10 rounded-xl font-medium shadow-md shadow-primary/10 bg-primary text-primary-foreground hover:opacity-90 active:scale-98 transition-all duration-200 px-5 flex items-center gap-1.5"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span>Create QR</span>
      </Button>
    </div>
  );
}