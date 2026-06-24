import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import { Role } from "@/generated/prisma/enums";

async function ensureWorkspaceAdmin(
  workspaceId: number,
  userId: number,
) {
  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });

  if (!member) {
    throw new ApiError(403, "Workspace access denied");
  }

  if (
    member.role !== Role.ADMIN &&
    member.role !== Role.SUPER_ADMIN
  ) {
    throw new ApiError(
      403,
      "Only admins can manage members",
    );
  }

  return member;
}

export async function listMembers(
  workspaceId: number,
) {
  return prisma.workspaceMember.findMany({
    where: {
      workspaceId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function addMember(
  workspaceId: number,
  currentUserId: number,
  userId: number,
  role: Role,
) {
  await ensureWorkspaceAdmin(
    workspaceId,
    currentUserId,
  );

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existing =
    await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

  if (existing) {
    throw new ApiError(
      409,
      "User already belongs to workspace",
    );
  }

  return prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId,
      role,
    },
  });
}

export async function updateMemberRole(
  workspaceId: number,
  currentUserId: number,
  memberId: number,
  role: Role,
) {
  await ensureWorkspaceAdmin(
    workspaceId,
    currentUserId,
  );

  const member =
    await prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
    });

  if (!member) {
    throw new ApiError(
      404,
      "Workspace member not found",
    );
  }

  return prisma.workspaceMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
    },
  });
}

export async function removeMember(
  workspaceId: number,
  currentUserId: number,
  memberId: number,
) {
  await ensureWorkspaceAdmin(
    workspaceId,
    currentUserId,
  );

  const member =
    await prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
    });

  if (!member) {
    throw new ApiError(
      404,
      "Workspace member not found",
    );
  }

  return prisma.workspaceMember.delete({
    where: {
      id: memberId,
    },
  });
}