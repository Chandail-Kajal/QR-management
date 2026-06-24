"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Cute minimal arrows

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function QRPagination({ page, totalPages, onChange }: Props) {
  // Graceful guard to hide pagination if there's only 1 page or none
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-3 py-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="h-9 w-9 rounded-xl border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-primary/40 transition-all duration-200"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
      </Button>

      {/* Center Status Pill */}
      <div className="inline-flex h-9 items-center justify-center rounded-xl bg-muted/60 border border-border/30 px-4 text-xs font-medium tracking-wide text-foreground/80 shadow-sm backdrop-blur-sm">
        <span>
          Page <strong className="font-semibold text-primary dark:text-primary">{page}</strong> of{" "}
          <span className="text-muted-foreground">{totalPages}</span>
        </span>
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="h-9 w-9 rounded-xl border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-primary/40 transition-all duration-200"
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4 stroke-[2.5]" />
      </Button>
    </div>
  );
}