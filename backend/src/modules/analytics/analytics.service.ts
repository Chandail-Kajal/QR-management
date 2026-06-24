import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";

async function validateQR(
  qrId: number,
  workspaceId: number,
) {
  const qr = await prisma.qR.findFirst({
    where: {
      id: qrId,
      workspaceId,
      deletedAt: null,
    },
  });

  if (!qr) {
    throw new ApiError(404, "QR not found");
  }

  return qr;
}

export async function getSummary(
  qrId: number,
  workspaceId: number,
) {
  await validateQR(qrId, workspaceId);

  const qr = await prisma.qR.findUnique({
    where: {
      id: qrId,
    },

    select: {
      scanCount: true,
    },
  });

  const todayStart = new Date();

  todayStart.setHours(0, 0, 0, 0);

  const todayScans = await prisma.qRScan.count({
    where: {
      qrId,
      scannedAt: {
        gte: todayStart,
      },
    },
  });

  return {
    totalScans: qr?.scanCount ?? 0,
    todayScans,
  };
}

export async function getTimeline(
  qrId: number,
  workspaceId: number,
  days: number,
) {
  await validateQR(qrId, workspaceId);

  const startDate = new Date();

  startDate.setDate(startDate.getDate() - days);

  const scans = await prisma.qRScan.findMany({
    where: {
      qrId,

      scannedAt: {
        gte: startDate,
      },
    },

    select: {
      scannedAt: true,
    },

    orderBy: {
      scannedAt: "asc",
    },
  });

  const grouped: Record<string, number> = {};

  scans.forEach((scan) => {
    const date = scan.scannedAt
      .toISOString()
      .split("T")[0];

    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped).map(
    ([date, scans]) => ({
      date,
      scans,
    }),
  );
}

export async function getCountries(
  qrId: number,
  workspaceId: number,
) {
  await validateQR(qrId, workspaceId);

  const scans = await prisma.qRScan.groupBy({
    by: ["country"],

    where: {
      qrId,
      country: {
        not: null,
      },
    },

    _count: {
      country: true,
    },

    orderBy: {
      _count: {
        country: "desc",
      },
    },
  });

  return scans.map((item) => ({
    country: item.country,
    scans: item._count.country,
  }));
}

export async function getCities(
  qrId: number,
  workspaceId: number,
) {
  await validateQR(qrId, workspaceId);

  const scans = await prisma.qRScan.groupBy({
    by: ["city"],

    where: {
      qrId,
      city: {
        not: null,
      },
    },

    _count: {
      city: true,
    },

    orderBy: {
      _count: {
        city: "desc",
      },
    },
  });

  return scans.map((item) => ({
    city: item.city,
    scans: item._count.city,
  }));
}