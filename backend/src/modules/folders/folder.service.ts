import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";

export async function createFolder(
  workspaceId: number,
  name: string,
) {
  const existing = await prisma.folder.findFirst({
    where: {
      workspaceId,
      name,
    },
  });

  if (existing) {
    throw new ApiError(
      409,
      "Folder already exists in this workspace",
    );
  }

  return prisma.folder.create({
    data: {
      name,
      workspaceId,
    },
  });
}

export async function listFolders(
  workspaceId: number,
) {
  return prisma.folder.findMany({
    where: {
      workspaceId,
    },

    include: {
      _count: {
        select: {
          qrs: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getFolder(
  id: number,
  workspaceId: number,
) {
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

export async function deleteFolder(
  id: number,
  workspaceId: number,
) {
  await getFolder(id, workspaceId);

  const qrCount = await prisma.qR.count({
    where: {
      folderId: id,
    },
  });

  if (qrCount > 0) {
    throw new ApiError(
      400,
      "Folder contains QR codes",
    );
  }

  await prisma.folder.delete({
    where: {
      id,
    },
  });
}