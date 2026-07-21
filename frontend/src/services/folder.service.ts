import { api } from "@/lib/api";
import { IApiMetaPagination, IApiResponse } from "@/types";
import { TCreateFolderDTO, TFolderDTO, TUpdateFolderDTO } from "@/types/folder";
import { AxiosError } from "axios";

interface Params {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export async function getFolders(params: Params) {
  try {
    const res = await api.get<IApiResponse<TFolderDTO[], IApiMetaPagination>>(
      "/folders",
      {
        params,
      },
    );
    return {
      items: res.data.data,
      pagination: res.data.meta.pagination,
    };
  } catch (error: unknown) {
    const msg = (error as AxiosError<IApiResponse<null>>).response?.data
      .message;
    throw new Error(msg);
  }
}

export async function getFolderByName({ name }: { name: string }) {
  try {
    const res = await api.get<IApiResponse<TFolderDTO>>(
      "/folders/by-name/" + name,
    );
    return res.data.data;
  } catch (error) {
    const msg = (error as AxiosError<IApiResponse<null>>).response?.data
      .message;
    throw new Error(msg);
  }
}

export async function createFolder(data: TCreateFolderDTO) {
  const res = await api.post<IApiResponse<TFolderDTO>>("/folders", data);
  return res.data.data;
}

export async function updateFolder(
  id: number | string,
  data: TUpdateFolderDTO,
) {
  const res = await api.patch<IApiResponse<TUpdateFolderDTO>>(
    "/folders/" + id,
    data,
  );
  return res.data.data;
}

export async function deleteFolder(id: number | string) {
  await api.delete("/folders/" + id);
}
