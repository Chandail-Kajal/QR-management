import { api } from "@/lib/api";
import {
  IApiMetaErrorStack,
  IApiMetaPagination,
  IApiResponse,
  TCreateQRDTO,
  TQRDTO,
  TUpdateQRDTO,
} from "@/types";
import { AxiosError } from "axios";

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

export async function getFolderQRs(
  params: Params,
  meta: { folderId: number | string; userId?: string },
) {
  console.log({ meta });
  const res = await api.get<IApiResponse<TQRDTO[], IApiMetaPagination>>(
    `/qrs/folders/${meta.folderId}`,
    {
      params: {
        userId: meta.userId,
        ...params,
      },
    },
  );
  return {
    items: res.data.data,
    pagination: res.data.meta?.pagination,
  };
}

export async function getQrTypeCounts(data: {
  folderId?: number | string;
  userId?: string;
}) {
  const res = await api.get<IApiResponse<{ type: string; count: number }[]>>(
    `/qrs/type-counts`,
    {
      params: {
        ...(data.folderId && { folderId: data.folderId }),
        ...(data.userId && { userId: data.userId }),
      },
    },
  );
  const result = res.data.data || [];
  return result;
}

export async function createQR(data: TCreateQRDTO) {
  try {
    const res = await api.post<IApiResponse<TQRDTO>>("/qrs", data);
    return res.data.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<IApiResponse<IApiMetaErrorStack>>).response?.data
        .message,
    );
  }
}

export async function updateQr(id: number | string, data: TUpdateQRDTO) {
  try {
    const res = await api.patch<IApiResponse<TQRDTO>>("/qrs/" + id, data);
    return res.data.data;
  } catch (error) {
    throw new Error(
      (error as AxiosError<IApiResponse<IApiMetaErrorStack>>).response?.data
        .message,
    );
  }
}

export async function deleteQR(id: number | string) {
  try {
    await api.delete("/qrs/" + id);
  } catch (error) {
    throw new Error(
      (error as AxiosError<IApiResponse<IApiMetaErrorStack>>).response?.data
        .message,
    );
  }
}

export async function changeStatus(data: { id: number; isActive: boolean }) {
  try {
    await api.put("/qrs/" + data.id, { isActive: data.isActive });
  } catch (error) {
    throw new Error(
      (error as AxiosError<IApiResponse<IApiMetaErrorStack>>).response?.data
        .message,
    );
  }
}
