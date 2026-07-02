"use client";
import { useEffect, useState } from "react";
import { FolderCard, NewFolderCard } from "./components/folder-card";
import { Grid, List } from "lucide-react";
import { SegmentedControl } from "@/components/segmented-control";
import { useFolders } from "@/hooks/use-folders";
import { FolderDialog } from "./components/add-update-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFolder, updateFolder } from "@/services/folder.service";
import { Toolbar } from "@/components/toolbar";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";

export default function FoldersPage() {
  const { setBreadcrumbs } = useUIStore();
  const { selectedWorkspaceId } = useAuthStore();
  const [page] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [open, setOpen] = useState(false);
  const [editValues, setEditValues] = useState<{
    name: string;
    id?: string | number;
  } | null>(null);

  const { data, isLoading, isError, error } = useFolders(
    page,
    debouncedSearch,
    selectedWorkspaceId as number,
  );
  const queryClient = useQueryClient();

  const router = useRouter();

  const folders = data?.items ?? [];

  const mutation = useMutation({
    mutationFn: async (data: { name: string; id?: string | number }) => {
      if (editValues) {
        updateFolder(editValues.id as number, { name: data.name });
      } else {
        createFolder(data);
      }
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
    onSuccess: () => {
      toast.success(
        editValues
          ? "Folder updated successfully"
          : "Folder created successfully",
      );
      setOpen(false);
      setEditValues(null);
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Folders", href: "/admin/folders" }]);
  }, [setBreadcrumbs]);

  return (
    <main className="flex-1 transition-colors duration-150 flex flex-col gap-4">
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search folders..."
        onCreate={() => {
          setOpen(true);
        }}
        createLabel="New Folder"
        rightAddons={
          <SegmentedControl
            value={viewMode}
            onChange={setViewMode}
            options={[
              {
                value: "grid",
                label: (
                  <>
                    <Grid size={16} /> Grid
                  </>
                ),
              },
              {
                value: "list",
                label: (
                  <>
                    <List size={16} /> List
                  </>
                ),
              },
            ]}
          />
        }
      />
      <div className="flex items-center justify-between ">
        <div className="text-[11px] font-medium  tracking-wider">
          ALL FOLDERS · {folders.length}
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-7">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onEdit={(folder) => {
                setEditValues({ name: folder.name, id: folder.id });
                setOpen(true);
              }}
              onForward={() => {
                router.push(`/admin/folders/${folder.name}`);
              }}
            />
          ))}
          <NewFolderCard onClick={() => setOpen(true)} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 ">
          {folders.map((folder, idx) => (
            <div
              key={idx}
              className=" p-3 border  rounded-md flex items-center justify-between"
            >
              <span className="font-medium text-xs">{folder.name}</span>
              <span className="text-[11px]">{folder.qrCount} items</span>
            </div>
          ))}
        </div>
      )}

      <FolderDialog
        mode={editValues ? "edit" : "create"}
        open={open}
        onOpenChange={setOpen}
        initialName={editValues ? editValues.name : ""}
        onSubmit={async ({ name }) => {
          mutation.mutate({ name });
        }}
      />
    </main>
  );
}
