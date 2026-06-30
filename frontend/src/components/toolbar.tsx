"use client";

import * as React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps extends React.ComponentProps<"div"> {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onCreate?: () => void;
  createLabel?: string;
  leftAddons?: React.ReactNode;
  rightAddons?: React.ReactNode;
  bottomAddon?: React.ReactNode;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search folders...",
  onCreate,
  createLabel = "New Folder",
  leftAddons,
  rightAddons,
  className,
  bottomAddon,
  ...props
}: ToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-4 w-full", className)} {...props}>
      {/* Primary Control Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left Control Group: Search + Inner Left Append Slots */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center max-w-2xl w-full">
          <div className="relative w-full max-w-md shrink-0">
            <Search
              size={18}
              className="text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-sm border border-border bg-surface pl-10 pr-4 text-sm text-text outline-none transition-colors placeholder:text-text-secondary focus:border-secondary"
            />
          </div>
          {leftAddons && (
            <div className="flex items-center gap-2 empty:hidden">
              {leftAddons}
            </div>
          )}
        </div>

        {/* Right Control Group: Inner Right Append Slots + Primary Create Action Button */}
        <div className="flex items-center gap-3 ml-auto md:ml-0 shrink-0">
          {rightAddons && (
            <div className="flex items-center gap-2 empty:hidden">
              {rightAddons}
            </div>
          )}

          {onCreate && (
            <Button
              onClick={onCreate}
              className="h-10 px-4 rounded-sm flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>{createLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Secondary Bottom Row (Left Anchor Slot) */}
      {bottomAddon && (
        <div className="flex items-center justify-start w-full border-t border-border-light pt-2 empty:hidden">
          {bottomAddon}
        </div>
      )}
    </div>
  );
}
