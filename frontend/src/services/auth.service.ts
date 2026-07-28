import { api } from "@/lib/api";
import { IApiResponse, ILoginResponseDTO } from "@/types";
import { AxiosError } from "axios";

type LoginValues = {
    email: string,
    password: string
}

type ChangePassword = {
    newPassword: string;
    currentPassword: string;
}

export const login = async (values: LoginValues) => {
    const response = await api.post<IApiResponse<ILoginResponseDTO>>(
        "/auth/login",
        values,
    );
    return response.data.data
}

export const changePassword = async (values: ChangePassword) => {
    try {

        await api.post<IApiResponse<null>>("/auth/change-password", values)
    } catch (error) {
        const message = (error as AxiosError<IApiResponse<null>>).response?.data.message
        throw new Error(message)
    }
}