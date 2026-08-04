import { prisma } from "@/config/prisma";
import { CreateSubPlan, ListSubPlan, UpdateSubPlan } from "./sub-plan.validations";
import { paginate } from "@/shared/utils/Paginate";

export const createSubPlan = async (data: CreateSubPlan) => {
    return await prisma.subscriptionPlan.create({ data: { ...data, allowedQRTypes: JSON.stringify(data.allowedQRTypes) } })
}

export const updateSubPlan = async (id: number, data: UpdateSubPlan) => {
    try {
        return await prisma.subscriptionPlan.update({
            where: { id }, data: {
                ...data, ...(data.allowedQRTypes ? { allowedQRTypes: JSON.stringify(data.allowedQRTypes) } : {})
            }
        })

    } catch (error) {
        console.log(error);
    }
}

export const deleteSubPlan = async (id: number) => {
    return await prisma.subscriptionPlan.delete({ where: { id } })
}

export const listSubPlan = (data: ListSubPlan) => {
    return paginate({
        prisma,
        model: { findMany: prisma.subscriptionPlan.findMany, count: prisma.subscriptionPlan.count },
        limit: data.limit,
        page: data.page
    })
}