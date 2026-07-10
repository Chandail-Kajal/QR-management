// utils/paginate.ts

import { PrismaClient } from "@prisma/client";

interface PaginateOptions {
    prisma: PrismaClient;

    model: {
        findMany(args?: any): Promise<any>;
        count(args?: any): Promise<number>;
    };

    page: number;
    limit: number;

    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
}

export async function paginate({
    prisma,
    model,
    page,
    limit,
    where,
    orderBy,
    include,
    select,
}: PaginateOptions) {
    const skip = (page - 1) * limit;

    const [items, totalItems] = await prisma.$transaction([
        model.findMany({
            where,
            orderBy,
            include,
            select,
            skip,
            take: limit,
        }),
        model.count({
            where,
        }),
    ]);

    return {
        items,

        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
        },
    };
}