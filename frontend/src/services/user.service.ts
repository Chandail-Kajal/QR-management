import { api } from "@/lib/api";
import { IApiMetaPagination, IApiResponse } from "@/types";

import { TCreateUserDTO, TUpdateUserDTO, TUserDTO } from "@/types/user";

interface Params {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export async function getUsers(params: Params) {
  const res = await api.get<IApiResponse<TUserDTO[], IApiMetaPagination>>(
    "/users",
    {
      params,
    },
  );
  return {
    items: res.data.data,
    pagination: res.data.meta.pagination,
  };
}

export async function getUserById(id: number | string) {
  const res = await api.get<IApiResponse<TUserDTO>>(`/users/${id}`);
  return res.data.data;
}

export async function createUser(data: TCreateUserDTO) {
  const res = await api.post<IApiResponse<TUserDTO>>("/users", data);
  return res.data.data;
}

export async function updateUser(id: number | string, data: TUpdateUserDTO) {
  const res = await api.patch<IApiResponse<TUserDTO>>(`/users/${id}`, data);
  return res.data.data;
}

export async function deleteUser(id: number | string) {
  await api.delete(`/users/${id}`);
}
