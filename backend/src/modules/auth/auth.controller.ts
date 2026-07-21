import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import bcrypt from "bcrypt";
import { Role, SubscriptionStatus } from "@/generated/prisma/client";
import { signAccessToken } from "@/shared/jwt";
import { SignupDto } from "./auth.validator";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: number;
  status: SubscriptionStatus;
  planId: number;
  startDate: Date;
  endDate: Date | null;
}

export interface LoginResult {
  user: AuthUser;
  subscription: UserSubscription | null;
  accessToken: string;
}

export const getUser = async (email?: string | null, id?: number | null) => {
  const user = await prisma.user.findFirst({
    where: {
      ...(email && {
        email: email.toLowerCase(),
      }),
      ...(id && {
        id,
      }),
      deletedAt: null, // Exclude soft-deleted users
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      subscriptions: {
        where: {
          status: {
            in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          status: true,
          planId: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const activeSubscription = user.subscriptions[0] || null;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    subscription: activeSubscription,
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const user = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      deletedAt: null,
    },
    select: {
      id: true,
      password: true,
    },
  });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  const profile = await getUser(null, user.id);
  if (!profile) throw new ApiError(404, "User profile not found");

  const accessToken = signAccessToken({
    userId: profile.user.id,
    userRole: profile.user.role,
  });
  return { ...profile, accessToken };
};

export async function createUser(dto: SignupDto) {
  const normalizedEmail = dto.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existing) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  return prisma.$transaction(async (tx) => {
    // 1. Create the User
    const user = await tx.user.create({
      data: {
        name: dto.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    // 2. Assign Default Free/Trial Subscription (14-day Trial)
    const fourteenDaysFromNow = new Date();
    fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

    await tx.subscription.create({
      data: {
        userId: user.id,
        planId: 1, // Default Free Plan ID (from seed)
        status: SubscriptionStatus.TRIALING,
        startDate: new Date(),
        endDate: fourteenDaysFromNow,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  });
}
