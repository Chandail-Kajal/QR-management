import { prisma } from "@/config/prisma";
import { ApiError } from "@/shared/utils";

interface RedirectMeta {
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
}

export async function resolveRedirect(
  token: string,
  meta: RedirectMeta,
) {
  const qr = await prisma.qR.findFirst({
    where: {
      token,
      status: "ACTIVE",
      deletedAt: null,
    },
  });

  if (!qr) {
    throw new ApiError(404, "QR code not found");
  }

  if (
    qr.scanLimit !== null &&
    qr.scanLimit !== undefined &&
    qr.scanCount >= qr.scanLimit
  ) {
    throw new ApiError(
      403,
      "QR scan limit reached",
    );
  }

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

        ipAddress: meta.ipAddress,

        userAgent: meta.userAgent,

        referer: meta.referer,
      },
    }),
  ]);

  let destination = "";

  switch (qr.type) {
    case "URL":
      destination = (qr.content as any).url;
      break;

    case "PHONE":
      destination = `tel:${(qr.content as any).phone}`;
      break;

    case "EMAIL":
      destination = `mailto:${(qr.content as any).email}`;
      break;

    case "SMS":
      destination = `sms:${(qr.content as any).phone}`;
      break;

    default:
      throw new ApiError(
        400,
        `Redirect not implemented for ${qr.type}`,
      );
  }

  return destination;
}