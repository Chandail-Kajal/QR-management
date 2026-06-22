import { prisma } from "@/config/prisma";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/utils";

export const workspace = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const workspaceHeader = req.header("x-workspace-id");

    if (!workspaceHeader) {
      throw new ApiError(400, "Workspace ID is required");
    }

    const workspaceId = Number(workspaceHeader);

    if (Number.isNaN(workspaceId) || workspaceId <= 0) {
      throw new ApiError(400, "Invalid workspace ID");
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        userId: req.auth?.userId as number,
        workspaceId,
      },
      select: {
        role: true,
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!membership) {
      throw new ApiError(403, "You do not have access to this workspace");
    }

    req.workspace = {
      id: membership.workspace.id,
      role: membership.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
