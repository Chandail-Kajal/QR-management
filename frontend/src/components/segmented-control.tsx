"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import clsx from "clsx";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  renderLabel?: (val: T, row: SegmentedOption<T>, index: number) => React.ReactNode
  options: SegmentedOption<T>[];
  maxItems?: number;
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  renderLabel,
  options,
  maxItems = 5,
  className,
}: SegmentedControlProps<T>) {

  const visibleOptions =
    options.length > maxItems
      ? options.slice(0, maxItems - 1)
      : options;

  const hiddenOptions =
    options.length > maxItems
      ? options.slice(maxItems - 1)
      : [];

  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-sm border border-border bg-surface p-0.5 gap-0.5",
        className,
      )}
    >
      {visibleOptions.map((option, index) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 p-2 text-sm rounded-sm font-medium transition-colors",
              // index !== 0 && "border-l border-border",
              active
                ? "bg-linear-120 from-purple-700 to-purple-500 text-white"
                : "text-text-secondary hover:bg-primary/5 hover:text-text",
            )}
          >
            {renderLabel?.(option.value, option, index) ?? option.label}
          </button>
        );
      })}

      {hiddenOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger >
            <button
              className={cn(
                "flex items-center gap-2 rounded-sm p-2 text-sm font-medium",
                hiddenOptions.some(o => o.value === value)
                  ? "bg-linear-120 from-purple-700 to-purple-500 text-white"
                  : "text-text-secondary hover:bg-primary/5"
              )}
            >
              More
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className={"w-56"}>
            {hiddenOptions.map((option, index) => (
              <DropdownMenuItem
                className={clsx("flex flex-row items-center", value === option.value && "border-primary/30 bg-secondary/50 text-white")}
                key={option.value}
                onClick={() => onChange(option.value)}
              >
                {renderLabel?.(option.value, option, index) ?? option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
