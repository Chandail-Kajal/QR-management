import { Router } from "express";
import { authRouter } from "./auth/auth.route";
import { qrRouter } from "./qr/qr.routes";

export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/qrs", qrRouter);
