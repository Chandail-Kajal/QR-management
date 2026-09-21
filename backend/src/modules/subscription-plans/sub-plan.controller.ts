import { prisma } from "@/config/prisma";
import { CreateSubPlan, ListSubPlan, UpdateSubPlan } from "./sub-plan.validations";
import { paginate } from "@/shared/utils/Paginate";

export const createSubPlan = async (data: CreateSubPlan) => {
    const { price, ...rest } = data;
    return await prisma.subscriptionPlan.create({
        data: {
            ...rest,
            allowedQRTypes: JSON.stringify(data.allowedQRTypes),
            ...(price != null ? { price } : {}),
        }
    })
}

export const updateSubPlan = async (id: number, data: UpdateSubPlan) => {
    try {
        const { price, ...rest } = data;
        return await prisma.subscriptionPlan.update({
            where: { id }, data: {
                ...rest,
                ...(rest.allowedQRTypes ? { allowedQRTypes: JSON.stringify(rest.allowedQRTypes) } : {}),
                ...(price !== undefined ? { price: price ?? undefined } : {}),
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