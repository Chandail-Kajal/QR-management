import { createQRSchema, listQRSchema } from "./qr.validator";
import { qrIdSchema, updateQRSchema } from "./qr.validator";
import type { Request, Response, NextFunction } from "express";
import * as service from "./qr.service";

export async function createQR(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = createQRSchema.parse(req.body);

    console.log({body, ...req.auth, ...req.workspace})

    const data = await service.createQR(
      body,
      req.workspace?.id as number,
      req.auth?.userId as number,
    );

    return res.status(201).json({
      message: "QR created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getQR(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = qrIdSchema.parse(req.params);

    const qr = await service.getQR(id, req.workspace!.id);

    return res.status(200).json({
      message: "QR fetched successfully",
      data: qr,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateQR(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = qrIdSchema.parse(req.params);

    const body = updateQRSchema.parse(req.body);

    const qr = await service.updateQR(id, req.workspace!.id, body);

    return res.status(200).json({
      message: "QR updated successfully",
      data: qr,
    });
  } catch (error) {
    next(error);
  }
}
export async function listQRs(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listQRSchema.parse(req.query);
    const data = await service.listQRs(query, req.workspace?.id as number);
    return res.status(200).json({
      message: "QRs fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}
