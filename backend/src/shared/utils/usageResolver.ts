// src/services/subscriptionUsage.ts

import { prisma } from "@/config/prisma";

export const usageResolvers = {
  maxQRCodes: (userId: number) =>
    prisma.qR.count({
      where: { userId },
    }),

  maxFolders: (userId: number) =>
    prisma.folder.count({
      where: { userId },
    }),

  maxCampaigns: (userId: number) =>
    prisma.campaign.count({
      where: { userId },
    }),

  maxFileUploads: (userId: number) =>
    prisma.file.count({
      where: { userId },
    }),
};