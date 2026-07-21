import { Request, Response, NextFunction } from "express";
import { APIResponse, Pagaintation } from "@/shared/utils/ApiResponse";
import { httpStatus } from "@/config/httpStatus";

export const apiResponseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.apiResponse = function <T>(
    statusCode: number,
    message?: string | null,
    data?: T,
    meta?: APIResponse<T>["meta"],
  ) {
    const httpRes = httpStatus[statusCode];
    const finalMessage = message ?? httpRes?.message ?? "Unknown Status Code";
    const response = new APIResponse(finalMessage, statusCode, data, meta);
    return this.status(statusCode).json(response);
  };

  next();
};
