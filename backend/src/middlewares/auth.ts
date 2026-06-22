import { logger } from "@/config/logger";
import { Role } from "@/generated/prisma/enums";
import { verifyAccessToken } from "@/shared/jwt";
import { ApiError } from "@/shared/utils";
import { AuthJwtPayload } from "@/types";
import { Request, Response, NextFunction } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.apiResponse(401, "Unauthorized: Token missing");
    }
    const payload = verifyAccessToken(token) as AuthJwtPayload;
    if (!payload || !payload.userId || !payload.userRole) {
      return res.apiResponse(401, "Unauthorized: Invalid token");
    }
    req.auth = { userId: payload.userId, userRole: payload.userRole! };
    next();
  } catch (error) {
    logger.error("UNAUTHORISED");
    return res.apiResponse(401, "Unauthorised Access!");
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.auth?.userRole === Role.ADMIN;
    if (isAdmin) {
      next();
    } else {
      throw new ApiError(403, "Operation Not Allowed!");
    }
  } catch (error) {
    next(error);
  }
};

export const isSuperAdminOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const flag = req.auth?.userRole === Role.SUPER_ADMIN;
    if (flag) {
      next();
    } else {
      throw new ApiError(403, "Operation Not Allowed!");
    }
  } catch (error) {
    next(error);
  }
};
