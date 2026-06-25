import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";
import { QRContent } from "@/types";

export const findQr = async (token: string) => {
  const result = await prisma.qR.findFirst({
    where: { token, deletedAt: null, status: "ACTIVE" },
  });
  if (!result) throw new ApiError(404, "QR not found");

  return result;
};