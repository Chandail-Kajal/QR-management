import { Request, Response } from "express";
import {prisma} from "@/config/prisma";

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
          take: 1,
          select: {
            status: true,
            endDate: true,
            plan: {
              select: {
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
      const activeSubscription = user.subscriptions[0];
      const plan = activeSubscription?.plan;

      // 1. Determine Plan Name
      const planName = plan?.name || "Free Trial";

      // 2. Map Database Subscription Status to UI Status
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

      // 3. QR Calculations & Breakdown
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

      // Categorize QR types into the 4 UI bucket breakdowns
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
            qrBreakdown.url += 1; // Default fallback category
        }
      });

      // 4. Monthly Normalized Revenue Calculation
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
    });
  } catch (error) {
    console.error("Error generating admin billing data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching billing analytics.",
    });
  }
};