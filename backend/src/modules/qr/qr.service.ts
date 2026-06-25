import { prisma } from "@/config/prisma";
import crypto from "crypto";
import { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/shared/utils";
import { ListQRInput, CreateQRInput, UpdateQRInput } from "./qr.validator";

export async function createQR(
  data: CreateQRInput,
  workspaceId: number,
  userId: number,
) {
  const token = crypto.randomBytes(8).toString("hex");

  console.log({ data, token, workspaceId, userId });

 const qr = await prisma.qR.create({
  data: {
    token,
    name: data.name,
    type: data.type,
    content: data.content as object ||{},
    folderId: data.folderId,
    workspaceId,
    createdById: userId,
    status: "ACTIVE",
  },
});

  return qr;
}

export async function getQR(id: number, workspaceId: number) {
  const qr = await prisma.qR.findFirst({
    where: {
      id,
      workspaceId,
    },
  });

  if (!qr) {
    throw new ApiError(404, "QR code not found");
  }
  return qr;
}

export async function updateQR(
  id: number,
  workspaceId: number,
  data: UpdateQRInput,
) {
  await getQR(id, workspaceId);

  const qr = await prisma.qR.update({
    where: {
      id,
    },
    data,
  });

  return qr;
}

export async function listQRs(query: ListQRInput, workspaceId: number) {
  const { page, limit, search, status } = query;

  const where = {
    workspaceId,

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          token: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),

    ...(status && {
      status,
    }),
  };

  const [items, totalItems] = await prisma.$transaction([
    prisma.qR.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      skip: (page - 1) * limit,

      take: limit,
    }),

    prisma.qR.count({
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

