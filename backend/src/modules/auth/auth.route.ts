import { env } from "@/env";
import { auth } from "@/middlewares";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/shared/jwt";
import { AuthJwtPayload } from "@/types";
import express, { Request, Response } from "express";
import { createUser, getUser, login, LoginResult } from "./auth.controller";
import { ApiError } from "@/shared/utils";
import { loginSchema, signupSchema } from "./auth.validator";

export const authRouter = express.Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password, remember } = loginSchema.parse(req.body);
  const result = await login(email, password);

  const payload: AuthJwtPayload = {
    userId: result.user.id,
    userRole: result.user.role,
  };

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

  res.apiResponse<LoginResult>(200, "Login success", result);
});

/* ===================== PROFILE ===================== */
authRouter.get("/profile", auth, async (req: Request, res: Response) => {
  const user = await getUser(null, req.auth?.userId as number);

  if (!user) throw new ApiError(400, "User not found!");

  return res.status(200).json({
    message: "Profile fetched successfully",
    data: user,
  });
});

authRouter.post("/refresh-token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new ApiError(401, "Refresh token is required");

  const decoded = verifyRefreshToken(refreshToken);
  const user = await getUser(null, decoded.userId);
  const payload: AuthJwtPayload = {
    userId: decoded.userId,
    userRole: user?.user.role as string,
  };
  const accessToken = signAccessToken(payload);
  res.apiResponse(200, null, { accessToken });
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, name, password } = signupSchema.parse(req.body);
  const createdUser = createUser({ name, email, password });
  res.apiResponse(200, null, createdUser);
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/",
  });
  return res.apiResponse(200);
});
//
