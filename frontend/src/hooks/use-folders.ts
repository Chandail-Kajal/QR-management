import { useQuery } from "@tanstack/react-query";
import { getFolderOptions, getFolders } from "@/services/folder.service";

export function useFolders(page: number, search: string, userId?: string) {
  return useQuery({
    queryKey: ["folders", page, search, userId],
    queryFn: () =>
      getFolders({
        page,
        limit: 10,
        search,
        userId,
      }),
  });
}

export function useFolderOptions(search: string, enabled = true) {
  return useQuery({
    queryKey: ["qr-folder-options", search],
    queryFn: () =>
      getFolderOptions(search) as Promise<{ label: string; value: number }[]>,
    enabled,
  });
}
