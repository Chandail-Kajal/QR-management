import express from "express";

import { overview } from "./dashboard.controller";

import {
  auth,
  workspace,
  allowRoles,
} from "@/middlewares";

export const dashboardRouter =
  express.Router();

dashboardRouter.use(auth);
dashboardRouter.use(workspace);

dashboardRouter.get(
  "/overview",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ),
  overview,
);