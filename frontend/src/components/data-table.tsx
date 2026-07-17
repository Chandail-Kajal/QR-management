/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export interface DataTableColumn<T> {
  label: string;
  dataIndex: keyof T | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  onSort?: (dataIndex: keyof T | string, order: "asc" | "desc") => void;
  className?: string;
}

export interface DataTablePaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  pagination: DataTablePaginationInfo;
  onNext: (page: number) => void;
  onPrev: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  emptyState?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pagination,
  onNext,
  onPrev,
  onLimitChange,
  limitOptions = [10, 20, 50],
  emptyState,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    order: "asc" | "desc";
  } | null>(null);

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.onSort) return;

    let order: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === String(column.dataIndex) &&
      sortConfig.order === "asc"
    ) {
      order = "desc";
    }

    setSortConfig({ key: String(column.dataIndex), order });
    column.onSort(column.dataIndex, order);
  };

  const { page, totalPages, limit, totalItems } = pagination;

  return (
    <div className="flex flex-col w-full border-border/60 bg-surface shadow-xs rounded-xl border overflow-hidden">
      <div className="min-h-[75vh] ">
        <Table className="" >
          <TableHeader>
            <TableRow className="border-b border-border-light bg-purple-700 hover:bg-purple-500">
              {columns.map((col, idx) => (
                <TableHead
                  key={String(col.dataIndex) + idx}
                  className={cn(
                    "h-11 text-sm font-semibold tracking-wider text-white uppercase select-none",
                    idx === 0 && "pl-5",
                    idx === columns.length - 1 && "pr-5 text-right",
                    col.className,
                  )}
                >
                  {col.onSort ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col)}
                      className="inline-flex items-center gap-1 hover:text-text transition-colors cursor-pointer"
                    >
                      {col.label}
                      <ArrowUpDown className="h-3 w-3 text-text-muted" />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="h-fit" >
            {data.length === 0 ? (
              <TableRow className="h-fit" >
                <TableCell colSpan={columns.length} className="p-0">
                  {emptyState ?? (
                    <div className="p-12 text-center text-text-secondary text-sm">
                      No matches or entries found.
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((record, rowIdx) => (
                <TableRow
                  key={record.id ?? rowIdx}
                  className="group border-b border-border-light transition-colors duration-150 bg-transparent hover:bg-surface-hover cursor-default"
                >
                  {columns.map((col, colIdx) => {
                    const value =
                      col.dataIndex in record
                        ? (record as any)[col.dataIndex]
                        : undefined;

                    return (
                      <TableCell
                        key={String(col.dataIndex) + colIdx}
                        className={cn(
                          "py-4 text-text font-medium text-sm",
                          colIdx === 0 && "pl-5",
                          colIdx === columns.length - 1 && "pr-5 text-right",
                          col.className,
                        )}
                      >
                        {col.render
                          ? col.render(value, record, rowIdx)
                          : String(value ?? "-")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 py-2 px-4 border-t border-border">
          {/* Row count limiter */}
          <div className="flex items-center gap-2 text-xs text-text-secondary flex-row justify-start">
            <span>Rows</span>
            {onLimitChange ? (
              <Select
                value={limit}
                onValueChange={(limit) => onLimitChange(Number(limit))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  {limitOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="font-semibold text-text">{limit}</span>
            )}
            <span className="text-text-muted ml-1 w-40">
              ({(page - 1) * limit + 1}–{Math.min(page * limit, totalItems)} of{" "}
              {totalItems})
            </span>
          </div>

          {/* Action buttons controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => onPrev(page - 1)}
              className="h-8 w-8 rounded-md border-border/80 bg-surface text-text-secondary hover:text-text hover:bg-surface-hover transition-all duration-200"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
            </Button>

            <div className="inline-flex h-8 items-center justify-center rounded-md bg-background-secondary border border-border-light px-3.5 text-xs font-medium text-text-secondary">
              <span>
                Page{" "}
                <strong className="font-semibold text-secondary">{page}</strong>{" "}
                of <span className="font-medium text-text">{totalPages}</span>
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => onNext(page + 1)}
              className="h-8 w-8 rounded-md border-border/80 bg-surface text-text-secondary hover:text-text hover:bg-surface-hover transition-all duration-200"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
