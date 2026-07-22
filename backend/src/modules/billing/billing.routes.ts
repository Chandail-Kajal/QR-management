import { allowRoles, auth } from "@/middlewares";
import { Router } from "express";
import { getAdminBillingData } from "./billing.controller";

export const billingRouter=Router()

billingRouter.route("/")
.all(auth,allowRoles("ADMIN"))
.get(getAdminBillingData)