/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { TQRDTO, QRStatus, TCreateQRDTO } from "@/types";

import { DataTable, DataTableColumn } from "@/components/data-table"; // Path to your new component
import { QRStatusBadge } from "./components/qr-status-badge";
import { QRActionsDropdown } from "./components/qr-action-dropdown";
import { useQRs } from "@/hooks/use-qrs";
import { QrModalForm } from "./components/add-update-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQR, updateQr } from "@/services/qr.service";
import { toast } from "sonner";
import { SegmentedControl } from "@/components/segmented-control";
import { getQRTypeIcon } from "@/lib/preview-type-icon";
import { QrCode } from "lucide-react";
import { Toolbar } from "@/components/toolbar";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  URL: { bg: "bg-primary/10", text: "text-primary" },
  TEXT: { bg: "bg-secondary/10", text: "text-secondary" },
  EMAIL: { bg: "bg-info/10", text: "text-info" },
  PHONE: { bg: "bg-success/10", text: "text-success" },
  SMS: { bg: "bg-warning/10", text: "text-warning" },
  WHATSAPP: { bg: "bg-success/10", text: "text-success" },
  WIFI: { bg: "bg-primary/10", text: "text-primary" },
  VCARD: { bg: "bg-warning/10", text: "text-warning" },
  FILE: { bg: "bg-text-secondary/10", text: "text-text-secondary" },
  GOOGLE_REVIEW: { bg: "bg-warning/10", text: "text-warning" },
  INSTAGRAM: { bg: "bg-accent/10", text: "text-accent" },
  FACEBOOK: { bg: "bg-info/10", text: "text-info" },
  LINKEDIN: { bg: "bg-info/10", text: "text-info" },
  X: { bg: "bg-text/10", text: "text-text" },
  YOUTUBE: { bg: "bg-danger/10", text: "text-danger" },
  TIKTOK: { bg: "bg-accent/10", text: "text-accent" },
  SOCIAL: { bg: "bg-secondary/10", text: "text-secondary" },
};

function getTypeColors(type: string) {
  return TYPE_COLORS[type] ?? { bg: "bg-primary/10", text: "text-primary" };
}

function getContentPreview(qr: TQRDTO) {
  const content = qr.content as any;
  if (!content) return "-";
  switch (qr.type) {
    case "URL":
      return content.url;
    case "TEXT":
      return content.text;
    case "EMAIL":
      return content.email;
    case "PHONE":
      return content.phone;
    case "SMS":
      return content.message || content.phone;
    case "WIFI":
      return `SSID: ${content.ssid}`;
    case "VCARD":
      return `${content.firstName ?? ""} ${content.lastName ?? ""}`.trim();
    case "WHATSAPP":
      return content.phone;
    case "FILE":
      return content.fileName;
    case "GOOGLE_REVIEW":
      return content.reviewUrl;
    case "INSTAGRAM":
    case "FACEBOOK":
    case "LINKEDIN":
    case "X":
    case "YOUTUBE":
    case "TIKTOK":
      return content.url;
    case "SOCIAL":
      return content.title || "Social Links";
    default:
      return "-";
  }
}

export default function QRsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [status, setStatus] = useState<QRStatus | undefined>();
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading } = useQRs(page, debouncedSearch, status); // Note: Ensure your API/hook supports passing limit if necessary
  const [editValues, setEditValues] = useState<TQRDTO | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: TCreateQRDTO) => {
      if (editValues) {
        await updateQr(editValues.id, { ...formData });
      } else {
        await createQR(formData);
      }
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
    onSuccess: () => {
      toast.success(
        editValues ? "QR updated successfully" : "QR created successfully",
      );
      setCreateOpen(false);
      setEditValues(null);
      queryClient.invalidateQueries({ queryKey: ["qrs"] });
    },
  });

  const onEdit = (qr: TQRDTO) => {
    setEditValues(qr);
    setCreateOpen(true);
  };

  const onDelete = (id: string | number) => {};

  const columns: DataTableColumn<TQRDTO>[] = [
    {
      label: "QR Details",
      dataIndex: "name",
      className: "pl-5",
      render: (_, qr) => {
        const colors = getTypeColors(qr.type);
        const Icon = getQRTypeIcon(qr.type);
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${colors.bg} ${colors.text}`}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="text-text font-semibold text-sm tracking-tight">
                  {qr.name}
                </p>
                <p className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">
                  {qr.type.replaceAll("_", " ")}
                </p>
              </div>
            </div>
            <p className="text-text-secondary max-w-87.5 truncate text-xs">
              {getContentPreview(qr)}
            </p>
            <div className="inline-flex w-fit rounded-md px-2 py-0.5 bg-background-secondary border border-border-light">
              <span className="text-text-secondary font-mono text-[10px] uppercase tracking-wider">
                {qr.token}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      label: "Status",
      dataIndex: "status",
      render: (status) => (
        <div className="inline-flex">
          <QRStatusBadge status={status} />
        </div>
      ),
    },
    {
      label: "Scans",
      dataIndex: "scanCount",
      render: (count) => (
        <span className="text-sm font-bold font-mono text-success">
          {Number(count).toLocaleString()}
        </span>
      ),
    },
    {
      label: "Created",
      dataIndex: "createdAt",
      render: (date) => (
        <span className="text-xs font-semibold text-text-secondary">
          {new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "",
      dataIndex: "actions",
      className: "pr-5 text-right w-14",
      render: (_, qr) => (
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <QRActionsDropdown qr={qr} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-sm text-text-secondary">Loading...</div>;
  }

  const paginationInfo = {
    page: page,
    limit: limit,
    totalItems: data?.pagination?.totalItems ?? data?.items?.length ?? 0,
    totalPages: data?.pagination?.totalPages ?? 1,
  };

  const emptyStatePlaceholder = (
    <div className="relative overflow-hidden rounded-xl bg-surface p-12 text-center flex flex-col items-center justify-center min-h-[280px] group">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl mb-4 bg-background-secondary border border-border text-secondary transition-transform duration-200 group-hover:scale-105">
        <QrCode className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-text text-sm font-semibold tracking-tight mb-1.5">
        No codes generated yet
      </h3>
      <p className="text-text-secondary text-xs max-w-60 leading-relaxed">
        Create your first QR code to start tracking scans and analytics.
      </p>
    </div>
  );

  return (
    <main className="flex-1 transition-colors duration-150 flex flex-col gap-4 pb-20">
      <Toolbar
        bottomAddon={
          <SegmentedControl
            options={[
              ...(["ACTIVE", "ARCHIVED", "PAUSED"] as QRStatus[]).map(
                (statusValue) => ({
                  label: <span className="text-xs">{statusValue}</span>,
                  value: statusValue,
                }),
              ),
            ]}
            value={status ?? "ACTIVE"}
            onChange={(val) => setStatus(val as QRStatus)}
          />
        }
        createLabel="New QR"
        searchQuery={search}
        onSearchChange={setSearch}
        onCreate={() => setCreateOpen(true)}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        pagination={paginationInfo}
        onNext={setPage}
        onPrev={setPage}
        onLimitChange={setLimit}
        emptyState={emptyStatePlaceholder}
      />

      <QrModalForm
        open={createOpen}
        onOpenChange={(val) => {
          if (!val) {
            setCreateOpen(false);
            setEditValues(null);
          }
        }}
        mode={editValues ? "edit" : "create"}
        initialData={
          editValues
            ? {
                name: editValues.name,
                content: editValues.content,
                status: editValues.status,
                type: editValues.type,
                scanLimit: editValues.scanCount || undefined,
              }
            : undefined
        }
        onSubmit={mutation.mutate}
      />
    </main>
  );
}
