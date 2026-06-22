"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { QRStatus } from "@/types";

import { QRTable } from "@/components/qr/qr-table";
import { QRPagination } from "@/components/qr/qr-pagination";
import { QRToolbar } from "@/components/qr/qr-toolbar";
import { useQRs } from "@/hooks/use-qrs";
import { CreateQRDialog } from "@/components/qr/create-qr.dialog";

export default function QRsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [status, setStatus] = useState<QRStatus | undefined>();

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQRs(page, debouncedSearch, status);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <QRToolbar
        search={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        status={status}
        onStatusChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
        onCreate={() => setCreateOpen(true)}
      />

      <QRTable items={data?.items ?? []} />

      <QRPagination
        page={page}
        totalPages={data?.pagination.totalPages ?? 1}
        onChange={setPage}
      />

      <CreateQRDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
