// src/middlewares/loadSubscription.ts

import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import { NextFunction, Request, Response } from "express";
import { usageResolvers } from "@/shared/utils/usageResolver";


export const loadSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [
        { endDate: null },
        { endDate: { gt: new Date() } },
      ],
    },
    include: {
      plan: true,
    },
  });

  if (!subscription) {
    throw new ApiError(403, "No active subscription found.");
  }

  if (!subscription.plan.isActive) {
    throw new ApiError(403, "Subscription plan is inactive.");
  }

  req.subscription = {
    id: subscription.id,
    userId: subscription.userId,
    planId: subscription.planId,
    plan: subscription.plan,
  };

  next();
};



type Feature = keyof typeof usageResolvers;

export const checkPlanLimit =
  (feature: Feature) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.subscription) {
      throw new ApiError(500, "Subscription not loaded.");
    }

    const limit = req.subscription.plan[feature];

    // Unlimited
    if (limit === null || limit === undefined || limit === -1) {
      return next();
    }

    const currentUsage = await usageResolvers[feature](
      req.subscription.userId
    );

    if (currentUsage >= limit) {
      throw new ApiError(
        403,
        `${feature} limit reached. Upgrade your plan to continue.`
      );
    }

    next();
  };