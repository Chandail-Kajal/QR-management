import { CreateQRInput, ListQRInput, UpdateQRInput } from "./qr.validator";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "@/config/prisma";
import { QRType } from "@/generated/prisma/enums";
import crypto from "crypto";
import { paginate } from "@/shared/utils/Paginate";
import { ApiError } from "@/shared/utils";

export function createQR(qrDetails: CreateQRInput, userId: number) {
  const token = crypto.randomBytes(8).toString("hex");

  return prisma.qR.create({
    data: {
      token,
      name: qrDetails.name,
      type: qrDetails.type,
      content: (qrDetails.content as object) || {},
      status: "ACTIVE",
      folderId: qrDetails.folderId,
      userId,
    },
  });
}

export async function getQR(id: number) {
  const qr = await prisma.qR.findFirst({
    where: {
      id,
    },
  });

  if (!qr) {
    throw new ApiError(404, "QR code not found");
  }
  return qr;
}

export async function getQrTypesWithCount(folderId?: number) {
  const where: Record<string, number> = {};

  if (folderId) {
    where.folderId = folderId;
  }
  const result = await prisma.qR.groupBy({
    by: ["type"],
    _count: {
      type: true,
    },
    where: {
      ...where,
    },
  });

  const data =
    result.length === 0
      ? Object.keys(QRType).map((i) => ({ type: i, count: 0 }))
      : result.map((item) => ({
          type: item.type,
          count: item._count.type,
        }));

  return data;
}

export async function updateQR(id: number, qr: UpdateQRInput) {
  return await prisma.qR.update({
    where: {
      id,
    },
    data: {
      ...qr,
    },
  });
}

export async function listQRs(
  query: ListQRInput & { userId?: number },
  folderId?: number,
) {
  const { page, limit, search, status, type, userId } = query;
  const where = {
    ...(type && { type }),
    ...(folderId && { folderId }),
    ...(userId && { userId }),
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

  const data = await paginate({
    prisma,
    limit,
    model: {
      count: prisma.qR.count,
      findMany: prisma.qR.findMany,
    },
    page,
    orderBy: { createdAt: "desc" },
    where,
  });

  return data;
}

export async function deleteQR(id: number) {
  return await prisma.qR.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}
