import { useQuery } from "@tanstack/react-query";
import { getFolderQRs, getQRs } from "@/services/qr.service";

export function useQRs(page: number, search: string, status?: string) {
  return useQuery({
    queryKey: ["qrs", page, search, status],
    queryFn: () =>
      getQRs({
        page,
        limit: 10,
        search,
        status,
      }),
  });
}

export function useFolderQRs(
  params: {
    page: number;
    search: string;
    status?: string;
    limit?: number;
  },
  workspaceId: number | string,
  folderId: number | string,
) {
  return useQuery({
    queryKey: [
      `qrs/${folderId}`,
      params.page,
      params.search,
      params.status,
      folderId,
      workspaceId,
    ],
    queryFn: () =>
      getFolderQRs(
        { ...params, limit: params.limit ? params.limit : 10 },
        folderId,
      ),
  });
}
