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

import { Plus } from "lucide-react";

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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-3">
        <Input
          placeholder="Search by name or token..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />

        <Select
          value={status ?? "ALL"}
          onValueChange={(value) =>
            onStatusChange(value === "ALL" ? undefined : (value as QRStatus))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>

            <SelectItem value="ACTIVE">Active</SelectItem>

            <SelectItem value="PAUSED">Paused</SelectItem>

            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create QR
      </Button>
    </div>
  );
}
