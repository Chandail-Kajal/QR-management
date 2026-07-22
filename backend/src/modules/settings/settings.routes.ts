import { allowRoles, auth } from "@/middlewares";
import { Router } from "express";
import { getAdminSettingsData } from "./settings.controller";

export const settingsRouter=Router()

settingsRouter.route("/")
.all(auth,allowRoles("ADMIN"))
.get(getAdminSettingsData)