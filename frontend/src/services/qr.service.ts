import { api } from "@/lib/api";
import {
  IApiMetaPagination,
  IApiResponse,
  TCreateQRDTO,
  TQRDTO,
  TUpdateQRDTO,
} from "@/types";

interface Params {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  type?: string;
}

export async function getQRs(params: Params) {
  const res = await api.get<IApiResponse<TQRDTO[], IApiMetaPagination>>(
    "/qrs",
    {
      params,
    },
  );
  return {
    items: res.data.data,
    pagination: res.data.meta.pagination,
  };
}

export async function getQRDetails(qrId: string) {
  const res = await api.get<IApiResponse<TQRDTO>>(`/qrs/${qrId}`);
  return res.data.data;
}

export async function getFolderQRs(params: Params, folderId: number | string) {
  const res = await api.get<IApiResponse<TQRDTO[], IApiMetaPagination>>(
    `/qrs/folders/${folderId}`,
    {
      params,
    },
  );
  return {
    items: res.data.data,
    pagination: res.data.meta?.pagination,
  };
}

export async function getQrTypeCounts(folderId?: number | string) {
  const res = await api.get<IApiResponse<{ type: string; count: number }[]>>(
    `/qrs/type-counts`,
    {
      params: { folderId },
    },
  );
  const result = res.data.data || [];
  return result;
}

export async function createQR(data: TCreateQRDTO) {
  const res = await api.post<IApiResponse<TQRDTO>>("/qrs", data);
  return res.data.data;
}

export async function updateQr(id: number | string, data: TUpdateQRDTO) {
  const res = await api.patch<IApiResponse<TQRDTO>>("/qrs/" + id, data);
  return res.data.data;
}

export async function deleteQR(id: number | string) {
  await api.delete("/qrs/" + id);
}
