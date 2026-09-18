import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import bcrypt from "bcrypt";
import { Role, SubscriptionStatus } from "@/generated/prisma/client";
import { signAccessToken } from "@/shared/jwt";
import { ChangePassword, SignupDto } from "./auth.validator";
import { calculatePlanEndDate } from "./auth.utils";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  allowCustomDesign: boolean;
  allowedQRTypes: string[];
  allowExpiryDate: boolean;
  allowPasswordProtection: boolean;
  analyticsHistoryDays: number;
  isFree: boolean;
  isActive: boolean;
  maxCampaigns: number;
  maxFileSizeMb: number;
  maxFileUploads: number;
  name: string;
  maxFolders: number;
  maxQRCodes: number;
  maxQRsPerFolder: number;
  maxScansPerQR: number;
  maxTotalScans: number;
  startDate: Date;
  expiryDate: Date;
  subscriptionStatus: SubscriptionStatus;
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
    },
  });

  if (!user) {
    return null;
  }

  const activeSubscription =
    (await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
      },
      select: {
        planId: true,
        startDate: true,
        id: true,
        endDate: true,
        status: true,
      },
    })) || null;
  if (!activeSubscription) throw new ApiError(400, "No subscription exists");
  const activeSubscriptionPlan = await prisma.subscriptionPlan.findUnique({
    where: { id: activeSubscription.planId },
    select: {
      allowCustomDesign: true,
      allowedQRTypes: true,
      allowExpiryDate: true,
      allowPasswordProtection: true,
      analyticsHistoryDays: true,
      isFree: true,
      isActive: true,
      maxCampaigns: true,
      maxFileSizeMb: true,
      maxFileUploads: true,
      name: true,
      maxFolders: true,
      maxQRCodes: true,
      maxQRsPerFolder: true,
      maxScansPerQR: true,
      maxTotalScans: true,
    },
  });

  console.log({ activeSubscription, activeSubscriptionPlan });

  // Parse allowedQRTypes if it's a JSON string (stored via JSON.stringify into a Json column)
  let parsedAllowedQRTypes: string[] = [];
  if (activeSubscriptionPlan?.allowedQRTypes) {
    const raw = activeSubscriptionPlan.allowedQRTypes;
    if (typeof raw === "string") {
      try {
        parsedAllowedQRTypes = JSON.parse(raw);
      } catch {
        parsedAllowedQRTypes = [];
      }
    } else if (Array.isArray(raw)) {
      parsedAllowedQRTypes = raw as string[];
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    subscription: {
      ...activeSubscriptionPlan,
      allowedQRTypes: parsedAllowedQRTypes,
      startDate: activeSubscription.startDate,
      expiryDate: activeSubscription.endDate,
      subscriptionStatus: activeSubscription.status,
    },
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
  const normalizedEmail = dto.email.trim().toLowerCase();

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
    const user = await tx.user.create({
      data: {
        name: dto.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    /**
     * Determine which subscription plan the user should receive.
     *
     * If planId is provided:
     *   - Validate that the plan exists and is active.
     *
     * If planId is not provided:
     *   - Assign the active free plan.
     */
    const plan = dto.planId
      ? await tx.subscriptionPlan.findFirst({
          where: {
            id: dto.planId,
            isActive: true,
          },
          select: {
            id: true,
            isFree: true,
            intervalType: true,
            intervalValue: true,
          },
        })
      : await tx.subscriptionPlan.findFirst({
          where: {
            isFree: true,
            isActive: true,
          },
          select: {
            id: true,
            isFree: true,
            intervalType: true,
            intervalValue: true,
          },
        });

    if (!plan) {
      throw new ApiError(
        400,
        dto.planId
          ? "Requested plan is not available!"
          : "No Free plan is available!",
      );
    }

    const startDate = new Date();

    const endDate = calculatePlanEndDate(
      startDate,
      plan.intervalType,
      plan.intervalValue,
    );

    await tx.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: plan.isFree
          ? SubscriptionStatus.TRIALING
          : SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
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

export async function changePassword(
  userId: number,
  passwords: ChangePassword,
) {
  const existingUser = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, password: true },
  });
  if (!existingUser) throw new ApiError(404, "User not exists");
  const isCurrentPasswordMatched = await bcrypt.compare(
    passwords.currentPassword,
    existingUser.password,
  );
  if (!isCurrentPasswordMatched)
    throw new ApiError(400, "Current password is invalid");
  const newHash = await bcrypt.hash(passwords.newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: newHash,
    },
  });

  return updatedUser;
}
