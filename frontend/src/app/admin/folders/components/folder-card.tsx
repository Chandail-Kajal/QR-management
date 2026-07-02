"use client";
import { Edit2, Forward, QrCode, Scan } from "lucide-react";
import { FolderPlus } from "lucide-react";
import { TFolderDTO } from "@/types/folder";
import { getQRTypeIcon } from "@/lib/preview-type-icon";

interface FolderCardProps {
  folder: TFolderDTO;
  onEdit?: (folder: TFolderDTO) => void;
  onForward?: (folder: TFolderDTO) => void;
}

export function FolderCard({ folder, onEdit, onForward }: FolderCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-secondary">
      <div className="flex h-20 items-center justify-center bg-secondary/10">
        <div className="flex items-center gap-2">
          {folder.previewTypes.length > 0 ? (
            folder.previewTypes.map((type) => {
              const Icon = getQRTypeIcon(type);

              return (
                <div
                  key={type}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm"
                >
                  <Icon size={18} className="text-secondary" />
                </div>
              );
            })
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <QrCode size={18} className="text-secondary" />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border p-3">
        <h3 className="truncate text-sm font-medium">{folder.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <QrCode size={13} />
            <span>{folder.qrCount} QR</span>
            <span>•</span>
            <Scan size={13} />
            <span>{folder.totalScans} scans</span>
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(folder);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onForward?.(folder);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted"
            >
              <Forward size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewFolderCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface transition-colors hover:bg-secondary/5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
        <FolderPlus size={20} className="text-secondary" />
      </div>

      <span className="text-sm font-medium">Create New Folder</span>
    </button>
  );
}
