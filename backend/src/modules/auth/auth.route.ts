import { env } from "@/env";
import { auth } from "@/middlewares";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/shared/jwt";
import { AuthJwtPayload } from "@/types";
import express, { NextFunction, Request, Response } from "express";
import { createUser, getUser, login } from "./auth.controller";
import { CreateUserDTO } from "../users/users.dto";

export const authRouter = express.Router();

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, remember } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const result = await login(email, password);

      const payload: AuthJwtPayload = {
        userId: result.user.id,
        userRole: result.workspaces[0]?.role,
      };

      const accessToken = signAccessToken(payload);

      const refreshToken = signRefreshToken(
        payload,
        remember
          ? 1000 * 60 * 60 * 24 * 30 // 30 days
          : 1000 * 60 * 60 * 24, // 1 day
      );

      res.cookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: env.IS_PRODUCTION,
        sameSite: "strict",
        maxAge: remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24,
      });

      return res.status(200).json({
        message: "Login successful",
        data: {
          user: result.user,
          workspaces: result.workspaces,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

/* ===================== PROFILE ===================== */
authRouter.get(
  "/profile",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getUser(null, req.auth?.userId as number);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
);

/* ===================== REFRESH TOKEN ===================== */
authRouter.post(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      const decoded = verifyRefreshToken(refreshToken);

      const user = await getUser(null, decoded.userId);

      const payload: AuthJwtPayload = {
        userId: decoded.userId,
        userRole: user?.workspaces[0].role as string,
      };

      const accessToken = signAccessToken(payload);

      return res.status(200).json({
        message: "Token refreshed successfully",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body as CreateUserDTO;
      const createdUser = createUser({ name, email, password });
      res.status(200).json({
        data: null,
        message: "Registered successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

/* ===================== LOGOUT ===================== */
authRouter.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refreshToken", {
        path: "/",
      });

      return res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);
//
