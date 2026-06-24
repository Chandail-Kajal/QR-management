import "express-serve-static-core";
import { Role } from "@/generated/prisma/enums";

declare module "express-serve-static-core" {
  interface Response {
    apiResponse: (
      statusCode: number,
      message?: string | null,
      data?: any,
      meta?: {
        pagination?: any;
        stack?: string | null;
        errors?: any;
      } | null,
    ) => this;
  }

  interface Request {
    auth?: { userId: number; userRole: string | null };
    workspace?: {
      id: number;
      role: Role;
    };
  }
}
