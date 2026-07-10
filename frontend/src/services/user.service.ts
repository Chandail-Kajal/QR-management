import { api } from "@/lib/api";
import { PaginatedDTO } from "@/types";
import {
    TCreateUserDTO,
    TUpdateUserDTO,
    TUserDTO,
} from "@/types/user"

interface Params {
    page: number;
    limit: number;
    search?: string;
    status?: string;
}

export async function getUsers(
    params: Params,
): Promise<PaginatedDTO<TUserDTO[]>> {
    const res = await api.get("/users", {
        params,
    });

    return res.data.data;
}

export async function getUserById(
    id: number | string,
): Promise<TUserDTO | null> {
    try {
        const res = await api.get(`/users/${id}`);
        return res.data.data;
    } catch (error) {
        return null;
    }
}

export async function createUser(
    data: TCreateUserDTO,
): Promise<TUserDTO> {
    const res = await api.post("/users", data);
    return res.data.data;
}

export async function updateUser(
    id: number | string,
    data: TUpdateUserDTO,
): Promise<TUserDTO> {
    const res = await api.patch(`/users/${id}`, data);
    return res.data.data;
}

export async function deleteUser(
    id: number | string,
): Promise<void> {
    await api.delete(`/users/${id}`);
}