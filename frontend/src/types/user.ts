export interface TUserDTO {
    id: number;
    name: string;
    email: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface TCreateUserDTO {
    name: string;
    email: string;
    password: string;
    status?: string;
}

export interface TUpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    status?: string;
}