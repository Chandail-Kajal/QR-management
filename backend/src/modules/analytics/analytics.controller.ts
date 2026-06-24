import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as service from "./analytics.service";

import {
  qrAnalyticsParamsSchema,
  timelineQuerySchema,
} from "./analytics.validators";

export async function summary(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } =
      qrAnalyticsParamsSchema.parse(req.params);

    const data =
      await service.getSummary(
        id,
        req.workspace!.id,
      );

    return res.status(200).json({
      message:
        "Analytics summary fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function timeline(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } =
      qrAnalyticsParamsSchema.parse(req.params);

    const { days } =
      timelineQuerySchema.parse(req.query);

    const data =
      await service.getTimeline(
        id,
        req.workspace!.id,
        days,
      );

    return res.status(200).json({
      message:
        "Timeline analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function countries(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } =
      qrAnalyticsParamsSchema.parse(req.params);

    const data =
      await service.getCountries(
        id,
        req.workspace!.id,
      );

    return res.status(200).json({
      message:
        "Country analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function cities(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } =
      qrAnalyticsParamsSchema.parse(req.params);

    const data =
      await service.getCities(
        id,
        req.workspace!.id,
      );

    return res.status(200).json({
      message:
        "City analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}

