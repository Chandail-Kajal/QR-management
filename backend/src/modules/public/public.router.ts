import { Router } from "express";
import { findQr } from "./public.controller";
import { generateVisitorId, resolveQRDestination } from "./public.utils";
import { prisma } from "@/config/prisma";
import { QRContent } from "@/types";

export const publicRouter = Router();

publicRouter.get("/qr/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const qr = await findQr(token);
    if (qr.scanLimit !== null && qr.scanCount >= qr.scanLimit) {
      return res.status(403).json({
        message: "QR scan limit reached",
      });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    await prisma.$transaction([
      prisma.qR.update({
        where: {
          id: qr.id,
        },
        data: {
          scanCount: {
            increment: 1,
          },
        },
      }),

      prisma.qRScan.create({
        data: {
          qrId: qr.id,
          ipAddress,
          userAgent,
          referer: req.headers["referer"],
          visitorId: generateVisitorId(ipAddress, userAgent),
        },
      }),
    ]);
    const redirectContent = resolveQRDestination(
      qr.content as unknown as QRContent,
    );
    res.status(200).json({ ...redirectContent });
  } catch (error) {
    next(error);
  }
});
