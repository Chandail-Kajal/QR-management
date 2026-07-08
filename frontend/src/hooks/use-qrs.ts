import { useQuery } from "@tanstack/react-query";
import { getFolderQRs, getQRs, getQrTypeCounts } from "@/services/qr.service";

export function useQRs(param: { page: number, search: string, status?: string, type?: string }) {
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

export function useQrTypeCounts(folderId?: string | number) {
  return useQuery({
    queryKey: ["qr-type-with-counts", folderId],
    queryFn: () =>
      getQrTypeCounts(folderId),
  });
}