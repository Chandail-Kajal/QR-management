import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import bcrypt from "bcrypt";
import { Role } from "@/generated/prisma/client";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWorkspace {
  id: number;
  name: string;
  slug: string;
  role: Role;
}

export interface LoginResult {
  user: AuthUser;
  workspaces: UserWorkspace[];
}

export const getUser = async (
  email?: string | null,
  id?: number | null,
): Promise<LoginResult | null> => {
  const user = await prisma.user.findFirst({
    where: {
      ...(email && {
        email: email.toLowerCase(),
      }),
      ...(id && {
        id,
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,

      workspaceMembers: {
        select: {
          role: true,
          workspace: {
            select: {
              name: true,
              id: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },

    workspaces: user.workspaceMembers.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      role: membership.role,
    })),
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const user = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
    },

    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const profile = await getUser(null, user.id);

  if (!profile) {
    throw new ApiError(404, "User not found");
  }

  return profile;
};
