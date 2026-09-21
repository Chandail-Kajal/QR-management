import { allowRoles, auth } from "@/middlewares";
import { Router } from "express";
import { getAdminBillingData, assignUserPlan } from "./billing.controller";

export const billingRouter = Router();

billingRouter
  .route("/")
  .all(auth, allowRoles("ADMIN"))
  .get(getAdminBillingData);

billingRouter
  .route("/assign-plan")
  .all(auth, allowRoles("ADMIN"))
  .post(assignUserPlan);