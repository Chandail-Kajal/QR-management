import { NextFunction, Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { getQRAnalyticsQuery } from "./analytics.validators";

export const getQRAnalytics = async (req: Request, res: Response) => {
  try {
    const qrId = Number(req.params.qrId);
    const { fromDate, toDate, days } = getQRAnalyticsQuery.parse(req.query);
    let startDate = new Date();
    let endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(11, 59, 59, 59);
    if (fromDate) {
      startDate = new Date(fromDate);
    } else {
      startDate.setDate(startDate.getDate() - (days - 1));
    }
    if (toDate) {
      endDate = new Date(endDate);
    }

    console.log(qrId);
    const qr = await prisma.qR.findUnique({
      where: { id: qrId },
      select: {
        id: true,
        name: true,
        token: true,
        createdAt: true,
        scanCount: true,
      },
    });

    if (!qr) {
      return res.apiResponse(404);
    }

    const [totalScans, uniqueVisitors, scansToday, lastScan] =
      await Promise.all([
        prisma.qRScan.count({
          where: { qrId },
        }),

        prisma.qRScan.groupBy({
          by: ["visitorId"],
          where: {
            qrId,
            visitorId: {
              not: null,
            },
          },
        }),

        prisma.qRScan.count({
          where: {
            qrId,
            scannedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),

        prisma.qRScan.findFirst({
          where: { qrId },
          orderBy: {
            scannedAt: "desc",
          },
          select: {
            scannedAt: true,
          },
        }),
      ]);

    //---------------------------------------
    // Scan Trend
    //---------------------------------------

    const trend = await prisma.qRScan.groupBy({
      by: ["scannedAt"],
      where: {
        qrId,
        scannedAt: {
          gte: startDate,
        },
      },
      _count: true,
      orderBy: {
        scannedAt: "asc",
      },
    });

    // Convert into daily buckets

    const map = new Map<
      string,
      {
        scans: number;
        visitors: Set<string>;
      }
    >();

    const scans = await prisma.qRScan.findMany({
      where: {
        qrId,
        scannedAt: {
          gte: startDate,
        },
      },
      select: {
        scannedAt: true,
        visitorId: true,
      },
    });

    scans.forEach((scan) => {
      const day = scan.scannedAt.toISOString().split("T")[0];

      if (!map.has(day)) {
        map.set(day, {
          scans: 0,
          visitors: new Set(),
        });
      }

      const item = map.get(day)!;

      item.scans++;

      if (scan.visitorId) {
        item.visitors.add(scan.visitorId);
      }
    });

    const scanTrend = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const key = d.toISOString().split("T")[0];

      scanTrend.push({
        date: key,
        scans: map.get(key)?.scans || 0,
        uniqueVisitors: map.get(key)?.visitors.size || 0,
      });
    }

    const scanTimes = await prisma.qRScan.findMany({
      where: { qrId },
      select: {
        scannedAt: true,
      },
    });

    const timeBuckets = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };

    scanTimes.forEach((scan) => {
      const hour = scan.scannedAt.getHours();

      if (hour >= 5 && hour < 12) timeBuckets.morning++;
      else if (hour >= 12 && hour < 17) timeBuckets.afternoon++;
      else if (hour >= 17 && hour < 21) timeBuckets.evening++;
      else timeBuckets.night++;
    });

    //---------------------------------------
    // Country
    //---------------------------------------

    const countries = await prisma.qRScan.groupBy({
      by: ["country"],
      where: { qrId },
      _count: true,
      orderBy: {
        _count: {
          country: "desc",
        },
      },
      take: 10,
    });

    const cities = await prisma.qRScan.groupBy({
      by: ["city"],
      where: { qrId },
      _count: true,
      orderBy: {
        _count: {
          city: "desc",
        },
      },
      take: 10,
    });

    const devices = await prisma.qRScan.groupBy({
      by: ["device"],
      where: { qrId },
      _count: true,
    });

    const browsers = await prisma.qRScan.groupBy({
      by: ["browser"],
      where: { qrId },
      _count: true,
    });

    const os = await prisma.qRScan.groupBy({
      by: ["os"],
      where: { qrId },
      _count: true,
    });

    const languages = await prisma.qRScan.groupBy({
      by: ["language"],
      where: { qrId },
      _count: true,
    });

    const referrers = await prisma.qRScan.groupBy({
      by: ["referer"],
      where: { qrId },
      _count: true,
      orderBy: {
        _count: {
          referer: "desc",
        },
      },
      take: 10,
    });

    return res.json({
      success: true,
      data: {
        overview: {
          totalScans,
          uniqueVisitors: uniqueVisitors.length,
          uniqueRate:
            totalScans === 0
              ? 0
              : Math.round((uniqueVisitors.length / totalScans) * 100),
          scansToday,
          lastScannedAt: lastScan?.scannedAt || null,
        },
        scanTrend,
        scanTime: timeBuckets,
        countries,
        cities,
        devices,
        browsers,
        os,
        languages,
        referrers,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to load analytics",
    });
  }
};

export const getWorkspaceDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workspaceId = Number(req.workspace?.id);

    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(now.getDate() - 30);

    const previous30 = new Date(last30);
    previous30.setDate(last30.getDate() - 30);

    const qrs = await prisma.qR.findMany({
      where: {
        folder: {
          workspaceId,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const qrIds = qrs.map((q) => q.id);

    if (!qrIds.length) {
      return res.json({
        totalScans: 0,
        activeQrCodes: 0,
        uniqueVisitors: 0,
        topPerformer: null,
        scanVolume: [],
        deviceSplit: [],
      });
    }

    const totalScans = await prisma.qRScan.count({
      where: {
        qrId: { in: qrIds },
      },
    });
    const activeQrCodes = await prisma.qR.count({
      where: {
        id: { in: qrIds },
      },
    });
    const uniqueVisitors = await prisma.qRScan.groupBy({
      by: ["visitorId"],
      where: {
        qrId: {
          in: qrIds,
        },
        visitorId: {
          not: null,
        },
      },
    });
    const top = await prisma.qRScan.groupBy({
      by: ["qrId"],
      where: {
        qrId: { in: qrIds },
      },
      _count: true,
      orderBy: {
        _count: {
          qrId: "desc",
        },
      },
      take: 1,
    });

    let topPerformer = null;

    if (top.length) {
      const qr = qrs.find((q) => q.id === top[0].qrId);

      topPerformer = {
        id: qr?.id,
        name: qr?.name,
        scans: top[0]._count,
      };
    }
    const scans = await prisma.qRScan.findMany({
      where: {
        qrId: { in: qrIds },
        scannedAt: {
          gte: last30,
        },
      },
      select: {
        scannedAt: true,
      },
      orderBy: {
        scannedAt: "asc",
      },
    });

    const scanVolume: Record<string, number> = {};

    scans.forEach((s) => {
      const day = s.scannedAt.toISOString().split("T")[0];

      scanVolume[day] = (scanVolume[day] || 0) + 1;
    });
    const devices = await prisma.qRScan.groupBy({
      by: ["device"],
      where: {
        qrId: {
          in: qrIds,
        },
      },
      _count: true,
    });

    const totalDevice = devices.reduce((a, b) => a + b._count, 0);

    const deviceSplit = devices.map((d) => ({
      device: d.device || "Unknown",
      scans: d._count,
      percent: totalDevice
        ? Number(((d._count / totalDevice) * 100).toFixed(1))
        : 0,
    }));

    const currentMonth = await prisma.qRScan.count({
      where: {
        qrId: { in: qrIds },
        scannedAt: {
          gte: last30,
        },
      },
    });

    const previousMonth = await prisma.qRScan.count({
      where: {
        qrId: { in: qrIds },
        scannedAt: {
          gte: previous30,
          lt: last30,
        },
      },
    });

    const growth =
      previousMonth === 0
        ? 100
        : Number(
            (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1),
          );

    res.json({
      totalScans,
      growth,
      activeQrCodes,
      uniqueVisitors: uniqueVisitors.length,
      topPerformer,
      scanVolume,
      deviceSplit,
    });
  } catch (err) {
    next(err);
  }
};
