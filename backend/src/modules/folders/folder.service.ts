import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import { ListFolderQuery } from "./folder.validator";

export async function createFolder(workspaceId: number, name: string) {
  const existing = await prisma.folder.findFirst({
    where: {
      workspaceId,
      name,
    },
  });

  if (existing) {
    throw new ApiError(409, "Folder already exists in this workspace");
  }

  return prisma.folder.create({
    data: {
      name,
      workspaceId,
    },
  });
}

export async function listFolders(query: ListFolderQuery, workspaceId: number) {
  const { page = 1, limit = 10, search } = query;

  const where = {
    workspaceId,
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const skip = (page - 1) * limit;

  const [total, folders, scans] = await prisma.$transaction([
    prisma.folder.count({
      where,
    }),

    prisma.folder.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        updatedAt: "desc",
      },
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
    }),

    prisma.qR.groupBy({
      by: ["folderId"],
      
      where: {
        workspaceId,
        folderId: {
          not: null,
        },
      },
      _sum: {
        scanCount: true,
      },
      orderBy: {
    folderId: 'asc', // Add this line to satisfy the required property
  },
    }),
  ]);

  const scanMap = new Map<number, number>(
    scans
      .filter((s): s is typeof s & { folderId: number } => s.folderId !== null)
      .map((s) => [s.folderId, s?._sum?.scanCount ?? 0]),
  );

  return {
    items: folders.map((folder) => ({
      id: folder.id,
      name: folder.name,

      qrCount: folder._count.qrs,
      totalScans: scanMap.get(folder.id) ?? 0,

      previewTypes: folder.qrs.map((q) => q.type),

      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    })),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getFolder(id: number, workspaceId: number) {
  const folder = await prisma.folder.findFirst({
    where: {
      id,
      workspaceId,
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

export async function getFolderByName(name: string, workspaceId: number) {
  const folder = await prisma.folder.findFirst({
    where: {
      name,
      workspaceId,
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
  workspaceId: number,
  name: string,
) {
  await getFolder(id, workspaceId);

  return prisma.folder.update({
    where: {
      id,
    },

    data: {
      name,
    },
  });
}

export async function deleteFolder(id: number, workspaceId: number) {
  await getFolder(id, workspaceId);

  const qrCount = await prisma.qR.count({
    where: {
      folderId: id,
    },
  });

  if (qrCount > 0) {
    throw new ApiError(400, "Folder contains QR codes");
  }

  await prisma.folder.delete({
    where: {
      id,
    },
  });
}
