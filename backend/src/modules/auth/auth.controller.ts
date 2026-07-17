import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import bcrypt from "bcrypt";
import { Role } from "@/generated/prisma/client";
import { CreateUserDTO } from "../users/user.validations";

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

export async function createUser(dto: CreateUserDTO) {
  const existing = await prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  });

  if (existing) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    dto.password,
    10
  );

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    await tx.workspace.create({
      data: {
        name: `${dto.name}'s Workspace`,
        slug: `workspace-${user.id}`,
        createdById: user.id,

        members: {
          create: {
            userId: user.id,
            role: "ADMIN",
          },
        },
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });
}
