import express from "express";

import { auth, workspace, allowRoles } from "@/middlewares";

import { createQR, listQRs, updateQR, getQR } from "./qr.controller";
import { prisma } from "@/config/prisma";

export const qrRouter = express.Router();

qrRouter.get("/r/:token", async (req, res, next) => {
  try {
    const { token } = req.params;

    const qr = await prisma.qR.findFirst({
      where: {
        token,
        status: "ACTIVE",
        deletedAt: null,
      },
    });

    if (!qr) {
      return res.status(404).json({
        message: "QR code not found",
      });
    }

    if (qr.scanLimit !== null && qr.scanCount >= qr.scanLimit) {
      return res.status(403).json({
        message: "QR scan limit reached",
      });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress;

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
          userAgent: req.headers["user-agent"],
          referer: req.headers["referer"],
        },
      }),
    ]);

   if (qr.type !== "URL") {
  return res.status(400).json({
    message: "Redirect not supported for this QR type",
  });
}

const url = (qr.content as any)?.url;

if (!url) {
  return res.status(400).json({
    message: "Invalid QR content",
  });
}

return res.json({
  redirectUrl: url,
});
  } catch (error) {
    next(error);
  }
});

qrRouter.use(auth);
qrRouter.use(workspace);

qrRouter.get(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  listQRs,
);

qrRouter.post("/", allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER"), createQR);

qrRouter.get(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  getQR,
);

qrRouter.patch("/:id", allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER"), updateQR);
