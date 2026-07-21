import { Prisma, PrismaClient } from "@/generated/prisma/client";

interface PaginatedResult<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export interface PaginateOptions<T> {
  prisma: PrismaClient;

  model: {
    findMany(args?: any): Prisma.PrismaPromise<T>;
    count(args?: any): Prisma.PrismaPromise<number>;
  };

  page: number;
  limit: number;

  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

export async function paginate<T>({
  prisma,
  model,
  page,
  limit,
  where,
  orderBy,
  include,
  select,
}: PaginateOptions<T>): Promise<PaginatedResult<T>> {
  const skip = (page - 1) * limit;

  const [data, totalItems] = await prisma.$transaction([
    model.findMany({
      where,
      orderBy,
      include,
      select,
      skip,
      take: limit,
    }),
    model.count({ where }),
  ]);

  return {
    data,
    meta: {
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    },
  };
}
