import { prisma } from "@/config/prisma";

export async function getOverview(workspaceId: number) {
  const [
    totalQrs,
    activeQrs,
    totalFolders,
    totalScans,
  ] = await Promise.all([
    prisma.qR.count({
      where: {
        workspaceId,
        deletedAt: null,
      },
    }),

    prisma.qR.count({
      where: {
        workspaceId,
        status: "ACTIVE",
        deletedAt: null,
      },
    }),

    prisma.folder.count({
      where: {
        workspaceId,
      },
    }),

    prisma.qR.aggregate({
      where: {
        workspaceId,
        deletedAt: null,
      },

      _sum: {
        scanCount: true,
      },
    }),
  ]);

  return {
    totalQrs,
    activeQrs,
    totalFolders,
    totalScans: totalScans._sum.scanCount ?? 0,
  };
}