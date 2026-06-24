import express from "express";

import {
  summary,
  timeline,
  countries,
  cities,
} from "./analytics.controller";

import {
  auth,
  workspace,
  allowRoles,
} from "@/middlewares";

export const analyticsRouter =
  express.Router();

analyticsRouter.use(auth);
analyticsRouter.use(workspace);

analyticsRouter.get(
  "/:id/analytics/summary",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ),
  summary,
);

analyticsRouter.get(
  "/:id/analytics/timeline",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ),
  timeline,
);

analyticsRouter.get(
  "/:id/analytics/countries",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ),
  countries,
);

analyticsRouter.get(
  "/:id/analytics/cities",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ),
  cities,
);