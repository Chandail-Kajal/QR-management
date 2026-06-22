"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { MoreHorizontal, Copy, Pencil, Trash, Download } from "lucide-react";

import { QRDTO } from "@/types";

export function QRActionsDropdown({ qr }: { qr: QRDTO }) {
  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/r/${qr.token}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="ghost">
          <MoreHorizontal size={18} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={copyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copy QR Link
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
