import { api } from "@/lib/api";
import {
  ApiResponse,
  PaginatedDTO,
  TCreateQRDTO,
  TQRDTO,
  TUpdateQRDTO,
} from "@/types";

interface Params {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export async function getQRs(params: Params): Promise<PaginatedDTO<TQRDTO[]>> {
  const res = await api.get("/qrs", {
    params,
  });

  return res.data.data;
}

export async function getQRDetails(qrId: string): Promise<TQRDTO> {
  const res = await api.get<ApiResponse<TQRDTO>>(`/qrs/${qrId}`);
  return res.data.data;
}

export async function getFolderQRs(
  params: Params,
  folderId: number | string,
): Promise<PaginatedDTO<TQRDTO[]>> {
  const res = await api.get(`/qrs/folders/${folderId}`, {
    params,
  });
  return res.data.data;
}

export async function createQR(data: TCreateQRDTO): Promise<TQRDTO> {
  const res = await api.post("/qrs", data);
  return res.data.data;
}

export async function updateQr(
  id: number | string,
  data: TUpdateQRDTO,
): Promise<TQRDTO> {
  const res = await api.patch("/qrs/" + id, data);
  return res.data.data;
}
