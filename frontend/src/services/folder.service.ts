import { api } from "@/lib/api";
import { PaginatedDTO } from "@/types";
import { TCreateFolderDTO, TFolderDTO, TUpdateFolderDTO } from "@/types/folder";

interface Params {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export async function getFolders(
  params: Params,
): Promise<PaginatedDTO<TFolderDTO[]>> {
  const res = await api.get("/folders", {
    params,
  });

  return res.data.data;
}

export async function createFolder(
  data: TCreateFolderDTO,
): Promise<TFolderDTO> {
  const res = await api.post("/folders", data);
  return res.data.data;
}

export async function updateFolder(
  id: number | string,
  data: TUpdateFolderDTO,
): Promise<TFolderDTO> {
  const res = await api.patch("/folders/" + id, data);
  return res.data.data;
}
