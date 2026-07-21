import bcrypt from "bcrypt";
import { prisma } from "@/config/prisma";
import { CreateUserDTO, UpdateUserDTO, ListUsersDTO } from "./user.validations";
import { paginate } from "@/shared/utils/Paginate";

const SALT_ROUNDS = 10;

export async function createUser(dto: CreateUserDTO) {
  const existing = await prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });
}

export async function updateUser(id: number, dto: UpdateUserDTO) {
  return prisma.user.update({
    where: {
      id,
    },

    data: {
      name: dto.name,
      email: dto.email,
    },

    select: {
      id: true,
      name: true,
      email: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: number) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function getUsers(query: ListUsersDTO) {
  const { page, limit, search } = query;
  const where = {
    role: "USER",
    deletedAt: null,
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  return paginate({
    prisma,
    model: {
      count: prisma.user.count,
      findMany: prisma.user.findMany,
    },
    page,
    limit,
    where,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
