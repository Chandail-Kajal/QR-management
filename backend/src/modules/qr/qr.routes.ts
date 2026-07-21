import express from "express";

import { auth, allowRoles } from "@/middlewares";

import {
  createQR,
  listQRs,
  updateQR,
  getQR,
  getQrTypesWithCount,
  deleteQR,
} from "./qr.controller";
import {
  createQRSchema,
  folderIdSchema,
  listQRSchema,
  qrIdSchema,
  updateQRSchema,
} from "./qr.validator";

export const qrRouter = express.Router();

qrRouter.use(auth);

qrRouter
  .route("/")
  .all(allowRoles("ADMIN", "USER"))
  .get(async (req, res) => {
    const userId =
      req.auth?.userRole === "ADMIN"
        ? undefined
        : Number(req.auth?.userId as number);
    const query = listQRSchema.parse(req.query);
    const data = await listQRs({ ...query, userId });
    res.apiResponse(200, null, data.data, data.meta);
  })
  .post(async (req, res) => {
    const qr = createQRSchema.parse(req.body);
    const newQr = await createQR(qr, req.auth?.userId as number);
    res.apiResponse(201, "Qr create successfully", newQr);
  });

qrRouter.get("/type-counts", allowRoles("ADMIN", "USER"), async (req, res) => {
  const { folderId } = req.query;
  const data = await getQrTypesWithCount(
    folderId ? Number(folderId) : undefined,
  );
  res.apiResponse(200, null, data);
});

qrRouter
  .route("/:id")
  .all(allowRoles("ADMIN", "USER"))
  .get(async (req, res) => {
    const { id } = qrIdSchema.parse(req.params);
    const qr = await getQR(id);
    res.apiResponse(200, null, qr);
  })
  .patch(async (req, res) => {
    const { id } = qrIdSchema.parse(req.params);
    const qr = updateQRSchema.parse(req.body);
    const updatedQr = await updateQR(id, qr);
    res.apiResponse(200, "Qr updated success", updatedQr);
  })
  .delete(async (req, res) => {
    const { id } = qrIdSchema.parse(req.params);
    await deleteQR(id);
    res.apiResponse(200, "Qr deleted successfully");
  });

qrRouter.get(
  "/folders/:folderId",
  allowRoles("ADMIN", "USER"),
  async (req, res) => {
    const userId =
      req.auth?.userRole === "ADMIN"
        ? undefined
        : Number(req.auth?.userId as number);
    const query = listQRSchema.parse(req.query);
    const { folderId } = folderIdSchema.parse(req.params);
    const data = await listQRs({ ...query, userId }, folderId);
    res.apiResponse(200, null, data.data, data.meta);
  },
);
