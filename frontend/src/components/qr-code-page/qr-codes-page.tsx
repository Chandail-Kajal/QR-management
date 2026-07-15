/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { TQRDTO, QRStatus, TCreateQRDTO } from "@/types";

import { DataTable, DataTableColumn } from "@/components/data-table"; // Path to your new component
import { QRStatusBadge } from "./components/qr-status-badge";
import { QRActionsDropdown } from "./components/qr-action-dropdown";
import { useFolderQRs, useQRs, useQrTypeCounts } from "@/hooks/use-qrs";
import { QrModalForm } from "./components/add-update-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQR, updateQr } from "@/services/qr.service";
import { toast } from "sonner";
import { SegmentedControl } from "@/components/segmented-control";
import { getQRTypeIcon } from "@/lib/preview-type-icon";
import { QrCode } from "lucide-react";
import { Toolbar } from "@/components/toolbar";
import { useUIStore } from "@/stores/ui.store";
import { useRouter } from "next/navigation";
import { getFolderByName } from "@/services/folder.service";
import { useAuthStore } from "@/stores/auth.store";
import { Breadcrumbs } from "../bread-crumbs";

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

export function QRsPage({ folderName }: { folderName?: string }) {
  const { setBreadcrumbs } = useUIStore();
  const { selectedWorkspaceId } = useAuthStore();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [type, setType] = useState<string | undefined>(undefined);
  const [debouncedSearch] = useDebounce(search, 500);
  const { data: typeCountArray = [], } = useQrTypeCounts();
  const [editValues, setEditValues] = useState<TQRDTO | null>(null);
  const queryClient = useQueryClient();

  const router = useRouter();

  const {
    data: folder,
    isLoading: _,
    isError: __,
  } = useQuery({
    queryKey: [`folders/${folderName}`],
    queryFn: async () => getFolderByName({ name: folderName as string }),
    enabled: !!folderName
  });

  const folderQRs = useFolderQRs(
    {
      page,
      search: debouncedSearch,
      type
    },
    {
      workspaceId: selectedWorkspaceId as number,
      folderId: folder?.id as number,
    },
    !!folderName
  );

  const allQRs = useQRs(
    {
      page,
      search: debouncedSearch,
      ...(type != "all" && { type })
    },
    !folderName
  );


  const { data, isLoading } = (folderName ? folderQRs : allQRs)||[];

  useEffect(() => {

    const crumbs = []
    if (folderName) {
      crumbs.push({ label: "Folders", href: "/admin/folders" },)
      crumbs.push({ label: folderName as string, href: "" })
    } else {
      crumbs.push({ label: "Qr Codes", href: "/admin/qr-codes" })
    }

    setBreadcrumbs(crumbs);
  }, [folderName, setBreadcrumbs]);

  const mutation = useMutation({
    mutationFn: async (formData: TCreateQRDTO) => {
      if (editValues) {
        await updateQr(editValues.id, {
          ...formData,
          ...(folderName && { folderId: folder?.id as number }),
        });
      } else {
        await createQR({ ...formData, ...(folderName && { folderId: folder?.id as number }), });
      }
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
    onSuccess: () => {
      toast.success(
        editValues ? "QR updated successfully" : "QR created successfully",
      );
      setCreateOpen(false);
      setEditValues(null);
      queryClient.invalidateQueries({ queryKey: [`qrs/${folder?.id}`] });
    },
  });

  const onEdit = (qr: TQRDTO) => {
    setEditValues(qr);
    setCreateOpen(true);
  };

  const onDelete = (id: string | number) => { };

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
          <QRActionsDropdown
            onAnalytics={() =>
              router.push(folderName ? `/admin/folders/${folderName}/analytics/${qr.id}` : `/admin/qr-codes/${qr.id}/analytics`)
            }
            qr={qr}
            onEdit={onEdit}
            onDelete={onDelete}
          />
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

  const totalCount = typeCountArray?.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <main className="flex-1 transition-colors duration-150 flex flex-col gap-4 pb-20">
      <Breadcrumbs />
      <Toolbar
        bottomAddon={
          <SegmentedControl
            maxItems={6}
            options={[{ label: <SegmentLabel label="All" count={totalCount || 0} isActive={type === "all"} />, value: "all" }, ...typeCountArray?.map(ob => ({
              label: <SegmentLabel label={ob.type} count={ob.count} isActive={type === ob.type} />,
              value: ob.type
            })) as { label: string | React.ReactElement, value: string }[]]}
            value={type ?? "all"}
            onChange={(val) => setType(val as QRStatus)}
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


const SegmentLabel = (props: { label: string, count: number, isActive: boolean }) => {
  return (<div className="flex w-full flex-row gap-1 justify-between items-center px-3">
    {props.label}
    <span className={`h-5 w-5  flex items-center justify-center text-xs rounded-full bg-purple-400 text-white ${props.isActive ? " font-semibold" : "font-thin"}`}>{props.count}
    </span></div>)
}