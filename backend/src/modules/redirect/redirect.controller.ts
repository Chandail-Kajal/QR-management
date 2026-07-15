import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as service from "./redirect.service";

export async function redirect(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    const ipAddress =
      req.headers["x-forwarded-for"]
        ?.toString()
        .split(",")[0]
        ?.trim() ||
      req.socket.remoteAddress;

    const destination =
      await service.resolveRedirect(
        token as string,
        {
          ipAddress,
          userAgent: req.headers["user-agent"],
          referer: req.headers["referer"],
        },
      );

    return res.redirect(302, destination);
  } catch (error) {
    next(error);
  }
}