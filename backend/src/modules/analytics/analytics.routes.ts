import express from "express";

import { getQRAnalytics, getWorkspaceDashboard } from "./analytics.controller";

import { auth, workspace } from "@/middlewares";

export const analyticsRouter = express.Router();

analyticsRouter.use(auth);
analyticsRouter.use(workspace);

analyticsRouter.get("/dashboard", getWorkspaceDashboard);
analyticsRouter.get("/:qrId", getQRAnalytics);

