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
import { QRDTO } from "@/types";
import QRCode from "qrcode";

export function QRActionsDropdown({
  qr,
  onEdit,
  onDelete,
}: {
  qr: QRDTO;
  onEdit: (qr: QRDTO) => void;
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
      <DropdownMenuTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost"
          className="h-9 w-9 rounded-xl border border-transparent hover:border-border/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 data-[state=open]:bg-muted data-[state=open]:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={6}
        className="w-48 p-1.5 border-border/60 bg-card/95 backdrop-blur-md shadow-xl rounded-2xl animate-in fade-in-50 slide-in-from-top-2 duration-200"
      >
        <DropdownMenuItem 
          onClick={() => onEdit(qr)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground/90 cursor-pointer transition-colors duration-150 focus:bg-primary/10 focus:text-primary"
        >
          <Pencil className="h-4 w-4 stroke-[2.25]" />
          <span>Edit Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={copyLink}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground/90 cursor-pointer transition-colors duration-150 focus:bg-primary/10 focus:text-primary"
        >
          <Copy className="h-4 w-4 stroke-[2.25]" />
          <span>Copy URL</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={handleDownload}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-foreground/90 cursor-pointer transition-colors duration-150 focus:bg-primary/10 focus:text-primary"
        >
          <Download className="h-4 w-4 stroke-[2.25]" />
          <span>Download Asset</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-border/40" />

        <DropdownMenuItem
          onClick={() => onDelete(qr.id)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-destructive cursor-pointer transition-colors duration-150 focus:bg-destructive/10 focus:text-destructive-foreground dark:focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 stroke-[2.25]" />
          <span>Delete Code</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}