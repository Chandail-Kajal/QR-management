import { Role } from "@/generated/prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/utils";

export const allowRoles = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.auth?.userRole;

    if (!userRole) {
      return next(new ApiError(403, "Workspace context is missing"));
    }

    if (!roles.includes(userRole as Role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action"),
      );
    }

    next();
  };
};
