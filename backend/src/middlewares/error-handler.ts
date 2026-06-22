/* eslint-disable @typescript-eslint/no-unused-vars */
import { logger } from "@/config/logger";
import { env } from "@/env";
import { ApiError } from "@/shared/utils/ApiError";
import { NextFunction, Request, Response } from "express";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@/generated/prisma/internal/prismaNamespace";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  let error: any = { ...err };
  error.message = err.message || "An error occurred";

  // Handle ApiError
  if (err instanceof ApiError) {
    error.statusCode = err.statusCode;
    error.isOperational = err.isOperational;
  }

  // Mongoose & Common Errors
  if (err.name === "ValidationError") {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(". ");
    error.isOperational = true;
  }

  if (err.name === "ValidatorError") {
    error.statusCode = 400;
    error.message = `Error: ${err.message}`;
    error.isOperational = true;
  }

  if (err.code === 11000) {
    error.statusCode = 400;
    error.message = "Duplicate field value entered";
    error.isOperational = true;
  }

  if (err.name === "CastError") {
    error.statusCode = 400;
    error.message = "Invalid resource ID";
    error.isOperational = true;
  }

  if (err instanceof SyntaxError) {
    error.statusCode = 400;
    error.message = "Invalid JSON payload";
    error.isOperational = true;
  }

  if (err.name === "JsonWebTokenError") {
    error.statusCode = 401;
    error.message = "Unauthorised Access!";
    error.isOperational = true;
  }

  if (err.name === "TokenExpiredError") {
    error.statusCode = 401;
    error.message = "Token Expired!";
    error.isOperational = true;
  }

  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = "Intrenal Server Error!";
    error.isOperational = false;
  }

  // Prisma Validation Error
  if (err instanceof PrismaClientValidationError) {
    error.statusCode = 400;
    error.message = "Invalid data provided";
    error.isOperational = true;
  }

  // Prisma Known Database Errors
  if (err instanceof PrismaClientKnownRequestError) {
    error.isOperational = true;

    switch (err.code) {
      // Unique constraint failed
      case "P2002":
        error.statusCode = 409;
        error.message = `Duplicate value for field: ${
          (err.meta?.target as string[])?.join(", ") || "unknown"
        }`;
        break;

      // Record not found
      case "P2025":
        error.statusCode = 404;
        error.message = "Requested resource not found";
        break;

      // Foreign key violation
      case "P2003":
        error.statusCode = 400;
        error.message = `Invalid reference: ${
          err.meta?.field_name || "foreign key constraint failed"
        }`;
        break;

      // Required relation missing
      case "P2014":
        error.statusCode = 400;
        error.message = "Invalid relationship between records";
        break;

      // Required value missing
      case "P2011":
        error.statusCode = 400;
        error.message = "Required field is missing";
        break;

      // Value too long
      case "P2000":
        error.statusCode = 400;
        error.message = "One or more fields exceed allowed length";
        break;

      default:
        error.statusCode = 400;
        error.message = `Database error (${err.code})`;
    }
  }

  // Prisma Unknown Error
  if (err instanceof PrismaClientUnknownRequestError) {
    error.statusCode = 500;
    error.message = "Unknown database error occurred";
    error.isOperational = false;
  }

  // Prisma Engine Panic
  if (err instanceof PrismaClientRustPanicError) {
    error.statusCode = 500;
    error.message = "Database engine failure";
    error.isOperational = false;
  }

  // Prisma Initialization Error
  if (err instanceof PrismaClientInitializationError) {
    error.statusCode = 503;
    error.message = "Unable to connect to database";
    error.isOperational = false;
  }

  // Logging
  if (env.IS_PRODUCTION) {
    if (error.isOperational) {
      logger.warn(JSON.stringify({ url: req.url, body: req.body }, null, 2));
      logger.warn(error);
    } else {
      logger.error(JSON.stringify({ url: req.url, body: req.body }, null, 2));
      logger.error(error);
    }
  } else {
    logger.error(error);
  }

  // Final API response
  if (res.apiResponse) {
    return res.apiResponse(
      error.statusCode,
      error.message,
      null,
      env.IS_PRODUCTION ? null : { stack: err.stack },
    );
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack: env.IS_PRODUCTION ? null : err.stack,
  });
};
