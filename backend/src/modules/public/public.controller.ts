import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";

export const findQr = async (token: string) => {
  const result = await prisma.qR.findFirst({
    where: { token, deletedAt: null, isActive: true },
  });
  if (!result) throw new ApiError(404, "QR not found");
  const endDate = new Date();
  endDate.setHours(11, 59, 59);
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: result.userId,
      canceledAt: null,
      endDate: { gte: endDate },
    },
    select: {
      plan: {
        select: {
          maxScansPerQR: true,
          maxTotalScans: true,
        },
      },
    },
  });
  console.log(result)
  if (!subscription) throw new ApiError(404, "QR not found!");

  if (result.scanLimit && result.scanLimit <= result.scanCount)
    throw new ApiError(429, "QR scan limit exceeded");

  if (
    (subscription.plan.maxScansPerQR &&
      subscription.plan.maxScansPerQR <= result.scanCount) ||
    (subscription.plan.maxTotalScans &&
      subscription.plan.maxTotalScans <= result.scanCount)
  )
    throw new ApiError(429, "Plan scan limit exceeded!");

  return result;
};
