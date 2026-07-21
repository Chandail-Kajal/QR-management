import "express-serve-static-core";
import { Role } from "@/generated/prisma/enums";
import { APIResponse } from "@/shared/utils";

declare module "express-serve-static-core" {
  interface Response {
    apiResponse: <T>(
      statusCode: number,
      message?: string | null,
      data?: T,
      meta?: { pagination?: Pagaintation; stack?: string } | null,
    ) => this;
  }

  interface Request {
    auth?: { userId: number; userRole: string | null };
  }
}
