import { Request, Response } from "express";
import { prisma } from "@/config/prisma";

// Interfaces mirroring the expected response contract
export type Role = "ADMIN" | "USER";
export type PlanType = "Free Trial" | "Monthly Pro" | "3-Month Pro" | "Yearly Enterprise" | string;
export type Status = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";

export interface UserBillingData {
  id: number;
  name: string;
  email: string;
  role: Role;
  plan: PlanType;
  planId: number | null;
  subscriptionId: number | null;
  startDate: string | null;
  endDate: string | null;
  status: Status;
  totalQRs: number;
  maxQRs: number;
  totalScans: number;
  firstQrDate: string; // ISO String
  monthlyRevenue: number;
  qrBreakdown: {
    url: number;
    vcard: number;
    social: number;
    file: number;
  };
}

/**
 * Controller to fetch aggregated billing and QR analytics for the admin dashboard.
 * @route GET /api/v1/billing
 */
export const getAdminBillingData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Fetch all active subscription plans from database
    const allPlans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        isFree: true,
        intervalType: true,
        intervalValue: true,
        maxQRCodes: true,
        maxTotalScans: true,
        maxFolders: true,
        allowCustomDesign: true,
      },
    });

    // Fetch users along with their active subscriptions, QR codes, scan aggregations, and completed payments
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        // Subscriptions ordered by latest
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
            plan: {
              select: {
                id: true,
                name: true,
                price: true,
                maxQRCodes: true,
                intervalType: true,
                intervalValue: true,
              },
            },
          },
        },
        // QR Codes with type for breakdown
        qrs: {
          where: { deletedAt: null },
          select: {
            type: true,
            scanCount: true,
            createdAt: true,
          },
        },
        // Completed payments for revenue calculation
        payments: {
          where: {
            status: "COMPLETED",
          },
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const billingData: UserBillingData[] = users.map((user) => {
      const activeSubscription =
        user.subscriptions.find((s) => s.status === "ACTIVE" || s.status === "TRIALING") ||
        user.subscriptions[0];
      const plan = activeSubscription?.plan;

      const planName = plan?.name || "Free Trial";
      const planId = plan?.id || null;
      const subscriptionId = activeSubscription?.id || null;
      const startDate = activeSubscription?.startDate ? activeSubscription.startDate.toISOString() : null;
      const endDate = activeSubscription?.endDate ? activeSubscription.endDate.toISOString() : null;

      let uiStatus: Status = "EXPIRED";
      if (activeSubscription) {
        const isCanceledOrExpired =
          activeSubscription.status === "CANCELED" || activeSubscription.status === "EXPIRED";

        if (!isCanceledOrExpired) {
          if (
            activeSubscription.endDate &&
            activeSubscription.endDate <= sevenDaysFromNow &&
            activeSubscription.endDate > now
          ) {
            uiStatus = "EXPIRING_SOON";
          } else if (!activeSubscription.endDate || activeSubscription.endDate > now) {
            uiStatus = "ACTIVE";
          }
        }
      }

      // QR Calculations & Breakdown
      const totalQRs = user.qrs.length;
      const maxQRs = plan?.maxQRCodes ?? 500; // Default or unlimited cap representation
      const totalScans = user.qrs.reduce((acc, qr) => acc + (qr.scanCount || 0), 0);

      // Find the earliest created QR date or fallback to user creation date
      const earliestQrDate = user.qrs.length
        ? user.qrs.reduce(
          (earliest, qr) => (qr.createdAt < earliest ? qr.createdAt : earliest),
          user.qrs[0].createdAt
        )
        : user.createdAt;

      // Categorize QR types into UI bucket breakdowns
      const qrBreakdown = {
        url: 0,
        vcard: 0,
        social: 0,
        file: 0,
      };

      user.qrs.forEach((qr) => {
        switch (qr.type) {
          case "URL":
            qrBreakdown.url += 1;
            break;
          case "VCARD":
            qrBreakdown.vcard += 1;
            break;
          case "FILE":
            qrBreakdown.file += 1;
            break;
          case "SOCIAL":
          case "INSTAGRAM":
          case "FACEBOOK":
          case "LINKEDIN":
          case "X":
          case "YOUTUBE":
          case "TIKTOK":
          case "WHATSAPP":
            qrBreakdown.social += 1;
            break;
          default:
            qrBreakdown.url += 1;
        }
      });

      // Monthly Normalized Revenue Calculation
      let monthlyRevenue = 0;
      if (plan && plan.price) {
        const basePrice = Number(plan.price);
        if (plan.intervalType === "MONTHS" && plan.intervalValue > 0) {
          monthlyRevenue = Math.round(basePrice / plan.intervalValue);
        } else if (plan.intervalType === "DAYS" && plan.intervalValue > 0) {
          monthlyRevenue = Math.round((basePrice / plan.intervalValue) * 30);
        } else {
          monthlyRevenue = Math.round(basePrice);
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: planName,
        planId,
        subscriptionId,
        startDate,
        endDate,
        status: uiStatus,
        totalQRs,
        maxQRs,
        totalScans,
        firstQrDate: earliestQrDate.toISOString(),
        monthlyRevenue,
        qrBreakdown,
      };
    });

    res.status(200).json({
      success: true,
      users: billingData,
      plans: allPlans,
    });
  } catch (error) {
    console.error("Error generating admin billing data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching billing analytics.",
    });
  }
};

/**
 * Controller to connect / assign a user to a subscription plan.
 * @route POST /api/v1/billing/assign-plan
 */
export const assignUserPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, planId, status = "ACTIVE" } = req.body;
    if (!userId || !planId) {
      res.status(400).json({
        success: false,
        message: "User ID and Plan ID are required.",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: Number(planId) },
    });
    if (!plan) {
      res.status(404).json({
        success: false,
        message: "Subscription plan not found.",
      });
      return;
    }

    const now = new Date();
    let endDate: Date | null = null;
    if (plan.intervalType === "MONTHS" && plan.intervalValue > 0) {
      endDate = new Date(now.getTime() + plan.intervalValue * 30 * 24 * 60 * 60 * 1000);
    } else if (plan.intervalType === "DAYS" && plan.intervalValue > 0) {
      endDate = new Date(now.getTime() + plan.intervalValue * 24 * 60 * 60 * 1000);
    }

    // Cancel previous active or trialing subscriptions for this user
    await prisma.subscription.updateMany({
      where: {
        userId: Number(userId),
        status: { in: ["ACTIVE", "TRIALING"] },
      },
      data: {
        status: "CANCELED",
        canceledAt: now,
      },
    });

    // Create the new subscription connecting user to the plan
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: Number(userId),
        planId: Number(planId),
        status: (status as any) || "ACTIVE",
        startDate: now,
        endDate,
      },
      include: {
        plan: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Successfully connected ${user.name} to plan ${plan.name}.`,
      data: newSubscription,
    });
  } catch (error) {
    console.error("Error assigning plan to user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while connecting user to the plan.",
    });
  }
};