import {
  ListFolderQuery,
  CreateFolder,
  updateFolder,
} from "./folder.validator";
import { ApiError } from "@/shared/utils";
import { prisma } from "@/config/prisma";
import { paginate } from "@/shared/utils/Paginate";

export async function createFolder(
  folderDetails: CreateFolder & { userId: number },
) {
  const folder = await prisma.folder.create({
    data: {
      name: folderDetails.name,
      userId: folderDetails.userId,
    },
  });
  return folder;
}

export async function getFolderOptions(search: string) {
  const folders = await prisma.folder.findMany({
    where: {
      name: {
        contains: search as string,
      },
    },
    select: {
      name: true,
      id: true,
    },
    take: 10,
  });
  return folders.map((f) => ({ label: f.name, value: f.id }));
}

export async function listFolders(query: ListFolderQuery, userId?: number) {
  const { limit, page, search } = query;
  const foldersPromise = paginate({
    prisma: prisma,
    limit,
    page,
    model: {
      count: prisma.folder.count,
      findMany: prisma.folder.findMany,
    },
    orderBy: {
      updatedAt: "desc",
    },
    ...(userId && { where: { userId } }),
    include: {
      _count: {
        select: {
          qrs: true,
        },
      },
      qrs: {
        select: {
          type: true,
        },
        take: 3,
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  const [folders, scans] = await Promise.all([
    foldersPromise,
    prisma.qR.groupBy({
      by: ["folderId"],
      where: {
        ...(userId && { userId }),
        folderId: {
          not: null,
        },
      },
      _sum: {
        scanCount: true,
      },
      orderBy: {
        folderId: "asc",
      },
    }),
  ]);

  const scanMap = new Map<number, number>(
    scans
      .filter((s): s is typeof s & { folderId: number } => s.folderId !== null)
      .map((s) => [s.folderId, s?._sum?.scanCount ?? 0]),
  );

  const data = {
    data: folders.data.map((folder) => ({
      id: folder.id,
      name: folder.name,
      qrCount: (folder as any)._count.qrs,
      totalScans: scanMap.get(folder.id) ?? 0,
      previewTypes: (folder as any).qrs.map((q: any) => q.type),
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    })),
    meta: { pagination: folders.meta.pagination },
  };

  return data;
}

export async function getFolderById(id: number) {
  const folder = await prisma.folder.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          qrs: true,
        },
      },
    },
  });
  return folder;
}

export async function getFolderByName(name: string) {
  const folder = await prisma.folder.findFirst({
    where: {
      name,
    },

    include: {
      _count: {
        select: {
          qrs: true,
        },
      },
    },
  });

  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  return folder;
}

export async function updateFolder(
  id: number,
  body: updateFolder & { userId: number },
) {
  const folderExists = await prisma.folder.findFirst({
    where: { id, userId: body.userId },
    select: { id: true },
  });
  if (!folderExists) throw new ApiError(404, "Folder does not exists");
  return await prisma.folder.update({
    where: { id, userId: body.userId },
    data: { name: body.name },
  });
}

export async function deleteFolder(id: number, userId: number) {
  const folder = await prisma.folder.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!folder) throw new ApiError(404, "folder does not exists");
  await prisma.qR.deleteMany({ where: { folderId: id } });
  return await prisma.folder.delete({ where: { id } });
}
