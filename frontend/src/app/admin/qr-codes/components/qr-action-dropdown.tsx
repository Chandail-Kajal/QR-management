"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Pencil, Trash2, Download } from "lucide-react";
import QRCode from "qrcode";
import { TQRDTO } from "@/types";

export function QRActionsDropdown({
  qr,
  onEdit,
  onDelete,
}: {
  qr: TQRDTO;
  onEdit: (qr: TQRDTO) => void;
  onDelete: (id: number | string) => void;
}) {
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/r/${qr.token}`);
  };

  const handleDownload = async () => {
    if (!qr.token) {
      console.warn("No text provided for the QR code.");
      return;
    }

    try {
      const qrUrl = await QRCode.toDataURL(
        `${window.location.origin}/r/${qr.token}`,
        {
          width: 500, // High quality for downloading
          margin: 2,
          errorCorrectionLevel: "H",
        },
      );

      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = `${qr.name}-${qr.token}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate or download QR code:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-md border border-transparent hover:border-border/60 hover:bg-surface-hover text-text-secondary hover:text-text transition-all duration-200 data-[state=open]:bg-surface-hover data-[state=open]:text-text"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-48 p-1 rounded-md border border-border/80 bg-surface shadow-md animate-in fade-in-50 slide-in-from-top-2 duration-100"
      >
        <DropdownMenuItem
          onClick={() => onEdit(qr)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-sm text-text font-medium cursor-pointer outline-none transition-colors duration-150 focus:bg-surface-hover focus:text-secondary"
        >
          <Pencil className="h-4 w-4 shrink-0 text-text-secondary group-focus:text-secondary" />
          <span>Edit Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={copyLink}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-sm text-text font-medium cursor-pointer outline-none transition-colors duration-150 focus:bg-surface-hover focus:text-secondary"
        >
          <Copy className="h-4 w-4 shrink-0 text-text-secondary group-focus:text-secondary" />
          <span>Copy URL</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleDownload}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-sm text-text font-medium cursor-pointer outline-none transition-colors duration-150 focus:bg-surface-hover focus:text-secondary"
        >
          <Download className="h-4 w-4 shrink-0 text-text-secondary group-focus:text-secondary" />
          <span>Download Asset</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 h-px bg-border-light" />

        <DropdownMenuItem
          onClick={() => onDelete(qr.id)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-sm text-danger font-medium cursor-pointer outline-none transition-colors duration-150 focus:bg-danger/10 focus:text-danger"
        >
          <Trash2 className="h-4 w-4 shrink-0 text-danger" />
          <span>Delete Code</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
