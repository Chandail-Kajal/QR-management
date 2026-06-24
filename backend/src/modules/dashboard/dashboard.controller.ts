import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as service from "./dashboard.service";

export async function overview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await service.getOverview(
      req.workspace!.id,
    );

    return res.status(200).json({
      message:
        "Dashboard overview fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}