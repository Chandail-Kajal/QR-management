import { getUsers, createUser, updateUser, deleteUser } from "@/services/user.service";
import { TUpdateUserDTO } from "@/types/user";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useUsers = (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
}) =>
    useQuery({
        queryKey: ["users", params],
        queryFn: () => getUsers(params),
    });

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: TUpdateUserDTO;
        }) => updateUser(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
        }: {
            id: number;
            data: TUpdateUserDTO;
        }) => deleteUser(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
    });
};