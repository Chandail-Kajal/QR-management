import express from "express";

import { getDashboard, getQRAnalytics } from "./analytics.controller";

import { auth } from "@/middlewares";
import { getQRAnalyticsQuery } from "./analytics.validators";
import { qrIdSchema } from "./analytics.validators";

export const analyticsRouter = express.Router();

analyticsRouter.use(auth);

analyticsRouter.get("/dashboard", async (req, res) => {
  const userId =
    req.auth?.userRole === "ADMIN" ? undefined : (req.auth?.userId as number);
  const data = await getDashboard(userId);
  res.apiResponse(200, null, data);
});

analyticsRouter.get("/:qrId", async (req, res) => {
  const { qrId } = qrIdSchema.parse(req.params);
  const { fromDate, toDate, days } = getQRAnalyticsQuery.parse(req.query);
  const data = await getQRAnalytics(qrId, { fromDate, toDate, days });
  res.apiResponse(200, null, data);
});
