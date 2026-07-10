import { Role } from "@/generated/prisma/enums";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  id: number;
  name?: string;
  email?: string;
}

export interface ListUsersDTO {
  page: number;
  limit: number;
  search?: string;
}