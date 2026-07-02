import express from "express";

import { auth, workspace, allowRoles } from "@/middlewares";

import { createQR, listQRs, updateQR, getQR } from "./qr.controller";

export const qrRouter = express.Router();

qrRouter.use(auth);
qrRouter.use(workspace);

qrRouter.get(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  listQRs,
);

qrRouter.get(
  "/folders/:folderId",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  listQRs,
);

qrRouter.post("/", allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER"), createQR);

qrRouter.get(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  getQR,
);

qrRouter.patch("/:id", allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER"), updateQR);
