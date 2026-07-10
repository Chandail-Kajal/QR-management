import bcrypt from "bcrypt";
import { prisma } from "@/config/prisma";
import {
    CreateUserDTO,
    UpdateUserDTO,
    ListUsersDTO
} from "./users.dto"
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

    const hashedPassword = await bcrypt.hash(
        dto.password,
        SALT_ROUNDS
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
                        role: "SUPER_ADMIN",
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

export async function updateUser(dto: UpdateUserDTO) {
    return prisma.user.update({
        where: {
            id: dto.id,
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

export async function listUsers(query: ListUsersDTO) {
    const { page, limit, search } = query;

    const where = {
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
        model: prisma.user,
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