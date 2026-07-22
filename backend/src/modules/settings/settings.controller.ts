import { Request, Response } from "express";
import {prisma} from "@/config/prisma";

// --- INTERFACES MATCHING THE UI CONTRACT ---
export interface SystemNotification {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  type: "SUBSCRIPTION_EXPIRING" | "SCAN_LIMIT_REACHED";
  message: string;
  daysRemaining?: number;
  scansLeft?: number;
  subscriptionId?: number;
  createdAt: string;
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "DEACTIVATED";
  planName: string;
  subscriptionId: number | null;
  qrsCount: number;
}

export interface QRScannerRecord {
  id: number;
  name: string;
  userId: number;
  userName: string;
  folderName: string;
  scanCount1m: number;
  scanCount3m: number;
  scanCount6m: number;
  scanCount12m: number;
  createdAt: string;
}

export interface AdminSettingsData {
  notifications: SystemNotification[];
  users: ManagedUser[];
  scanners: QRScannerRecord[];
}

/**
 * Controller to fetch system notifications, user accounts, and scan history analytics
 * for the admin settings dashboard.
 * @route GET /api/v1/settings
 */
export const getAdminSettingsData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Date boundaries for scan count aggregations
    const date1m = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const date3m = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const date6m = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const date12m = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // 1. FETCH MANAGED USERS
    const dbUsers = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            endDate: true,
            plan: { select: { name: true } },
          },
        },
        _count: {
          select: { qrs: { where: { deletedAt: null } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const managedUsers: ManagedUser[] = dbUsers.map((user) => {
      const activeSub = user.subscriptions[0];
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status === "ACTIVE" ? "ACTIVE" : "DEACTIVATED",
        planName: activeSub?.plan?.name || "Free Trial",
        subscriptionId: activeSub?.id || null,
        qrsCount: user._count.qrs,
      };
    });

    // 2. GENERATE SYSTEM NOTIFICATIONS & ALERTS
    const notifications: SystemNotification[] = [];
    let notificationIdCounter = 1000;

    // A. Query subscriptions expiring within 7 days
    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: { in: ["ACTIVE", "TRIALING"] },
        endDate: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { name: true } },
      },
    });

    expiringSubscriptions.forEach((sub) => {
      const diffMs = sub.endDate!.getTime() - now.getTime();
      const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      notifications.push({
        id: ++notificationIdCounter,
        userId: sub.user.id,
        userName: sub.user.name,
        userEmail: sub.user.email,
        type: "SUBSCRIPTION_EXPIRING",
        message: `${sub.plan.name} subscription expires in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}.`,
        daysRemaining,
        subscriptionId: sub.id,
        createdAt: sub.updatedAt.toISOString(),
      });
    });

    // B. Query QRs nearing scan limit (>= 90% reached)
    const cappedQrs = await prisma.qR.findMany({
      where: {
        deletedAt: null,
        scanLimit: { not: null, gt: 0 },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    cappedQrs.forEach((qr) => {
      if (qr.scanLimit && qr.scanCount >= Math.floor(qr.scanLimit * 0.9)) {
        const scansLeft = Math.max(0, qr.scanLimit - qr.scanCount);
        const percent = Math.round((qr.scanCount / qr.scanLimit) * 100);

        notifications.push({
          id: ++notificationIdCounter,
          userId: qr.user.id,
          userName: qr.user.name,
          userEmail: qr.user.email,
          type: "SCAN_LIMIT_REACHED",
          message: `QR code '${qr.name}' has reached ${percent}% of scan limit (${qr.scanCount.toLocaleString()} / ${qr.scanLimit.toLocaleString()} scans).`,
          scansLeft,
          createdAt: qr.updatedAt.toISOString(),
        });
      }
    });

    // 3. FETCH QR SCANNERS WITH TIME-WINDOW SCAN COUNTS
    const qrs = await prisma.qR.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
        folder: { select: { name: true } },
        scans: {
          where: { scannedAt: { gte: date12m } },
          select: { scannedAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const scannerRecords: QRScannerRecord[] = qrs.map((qr) => {
      let count1m = 0;
      let count3m = 0;
      let count6m = 0;
      let count12m = qr.scans.length;

      qr.scans.forEach((scan) => {
        const time = scan.scannedAt.getTime();
        if (time >= date1m.getTime()) count1m++;
        if (time >= date3m.getTime()) count3m++;
        if (time >= date6m.getTime()) count6m++;
      });

      return {
        id: qr.id,
        name: qr.name,
        userId: qr.user.id,
        userName: qr.user.name,
        folderName: qr.folder?.name || "Unorganized",
        scanCount1m: count1m,
        scanCount3m: count3m,
        scanCount6m: count6m,
        scanCount12m: count12m,
        createdAt: qr.createdAt.toISOString().split("T")[0],
      };
    });

    // 4. RETURN AGGREGATED PAYLOAD
    res.status(200).json({
      success: true,
      data: {
        notifications,
        users: managedUsers,
        scanners: scannerRecords,
      },
    });
  } catch (error) {
    console.error("Error generating admin settings data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching settings analytics.",
    });
  }
};