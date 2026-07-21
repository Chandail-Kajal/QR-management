import { Router } from "express";
import { authRouter } from "./auth/auth.route";
import { qrRouter } from "./qr/qr.routes";
import { folderRouter } from "./folders/folder.route";
import { publicRouter } from "./public/public.router";
import { analyticsRouter } from "./analytics/analytics.routes";
import { usersRouter } from "./users/users.route";

export const v1Router = Router();

v1Router.use("/public", publicRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/qrs", qrRouter);
v1Router.use("/folders", folderRouter);
v1Router.use("/analytics", analyticsRouter);
v1Router.use("/users", usersRouter);
