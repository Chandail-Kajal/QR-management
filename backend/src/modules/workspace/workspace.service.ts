import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";

export async function createWorkspace(
  userId: number,
  data: {
    name: string;
    slug: string;
  },
) {
  const existing = await prisma.workspace.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existing) {
    throw new ApiError(409, "Workspace slug already exists");
  }

  return prisma.workspace.create({
    data: {
      name: data.name,
      slug: data.slug,

      createdById: userId,

      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },

    include: {
      members: true,
    },
  });
}



export async function listWorkspaces(userId: number) {
  return prisma.workspace.findMany({
    where: {
      deletedAt: null,

      members: {
        some: {
          userId,
        },
      },
    },

    include: {
      _count: {
        select: {
          members: true,
          qrs: true,
          folders: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getWorkspace(
  id: number,
  userId: number,
) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id,

      deletedAt: null,

      members: {
        some: {
          userId,
        },
      },
    },

    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },

      _count: {
        select: {
          qrs: true,
          folders: true,
        },
      },
    },
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  return workspace;
}



export async function updateWorkspace(
  id: number,
  userId: number,
  data: {
    name?: string;
  },
) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.createdById !== userId) {
    throw new ApiError(
      403,
      "Only workspace owner can update workspace",
    );
  }

  return prisma.workspace.update({
    where: { id },
    data,
  });
}

export async function deleteWorkspace(
  id: number,
  userId: number,
) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.createdById !== userId) {
    throw new ApiError(
      403,
      "Only workspace owner can delete workspace",
    );
  }

  await prisma.workspace.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return true;
}