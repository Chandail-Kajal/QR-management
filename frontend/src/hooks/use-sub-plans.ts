import { createSubPlan, deleteSubPlan, listSubPlans, updateSubPlan } from "@/services/sub-plans.service"
import { TSubPlanDTO } from "@/types/sub-plan.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateSubPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSubPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sub-plans"] })
        }
    })
}

export const useDeleteSubPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSubPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sub-plans"] })
        }
    })
}

export const useUpdateSubPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSubPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sub-plans"] })
        }
    })
}

export const useSubPlans = (page: number, limit: number) => {
    return useQuery({
        queryKey: ["sub-plans", page, limit],
        queryFn: () => listSubPlans({ page, limit })
    })
}