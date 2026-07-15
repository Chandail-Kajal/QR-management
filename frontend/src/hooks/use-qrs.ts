import { useQuery } from "@tanstack/react-query";
import { getFolderQRs, getQRs, getQrTypeCounts } from "@/services/qr.service";

export function useQRs(param: { page: number, search: string, status?: string, type?: string }, enabled: boolean = true) {
  return useQuery({
    queryKey: ["qrs", param.page, param.search, param.status, param.type],
    queryFn: () =>
      getQRs({
        page: param.page,
        limit: 10,
        search: param.search,
        status: param.status,
        type: param.type
      }),
    enabled
  });
}

export function useFolderQRs(
  params: {
    page: number;
    search: string;
    status?: string;
    limit?: number;
    type?: string
  },
  meta: {
    workspaceId: number | string,
    folderId: number | string,
  },
  enabled = true
) {
  return useQuery({
    queryKey: [
      `qrs/${meta.folderId}`,
      params.page,
      params.search,
      params.status,
      meta.folderId,
      meta.workspaceId,
      params.type
    ],
    queryFn: () =>
      getFolderQRs(
        { ...params, limit: params.limit ? params.limit : 10, type: params.type },
        meta.folderId,
      ),
      enabled 
  });
}

export function useQrTypeCounts(folderId?: string | number) {
  return useQuery({
    queryKey: ["qr-type-with-counts", folderId],
    queryFn: () =>
      getQrTypeCounts(folderId),
  });
}