import { CreateSubPlanValues, UpdateSubPlanValues } from "@/app/admin/sub-plans/validations";
import { api } from "@/lib/api";
import { IApiMetaPagination, IApiResponse } from "@/types";
import { TSubPlanDTO } from "@/types/sub-plan.types";

export const createSubPlan = (data: CreateSubPlanValues) => {
    return api.post<IApiResponse<TSubPlanDTO>>("/sub-plans", data)
}

export const updateSubPlan = (data: UpdateSubPlanValues & { editingId: number }) => {
    return api.patch<IApiResponse<TSubPlanDTO>>(`/sub-plans/${data.editingId}`, data)
}

export const deleteSubPlan = (id: number) => {
    return api.delete(`/sub-plans/${id}`)
}


export const listSubPlans = async (query: { page: number, limit: number }) => {
    const { data } = await api.get<IApiResponse<TSubPlanDTO[], IApiMetaPagination>>("/sub-plans", { params: query })
    return {
        items: data.data,
        pagination: data.meta.pagination
    }
}