import express from "express";

import { auth, allowRoles } from "@/middlewares";

import {
  createQR,
  listQRs,
  updateQR,
  getQR,
  getQrTypesWithCount,
  deleteQR,
  qrStatus,
} from "./qr.controller";
import {
  createQRSchema,
  folderIdSchema,
  isActiveSchema,
  listQRSchema,
  qrIdSchema,
  updateQRSchema,
} from "./qr.validator";
import { checkPlanLimit, loadSubscription } from "@/middlewares/subscription-checker";

export const qrRouter = express.Router();

qrRouter.use(auth, loadSubscription);

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
  .post(checkPlanLimit("maxQRCodes"), async (req, res) => {
    const { userId: uid, ...qr } = createQRSchema.parse(req.body);
    const userId =
      req.auth?.userRole === "ADMIN" ? uid : (req.auth?.userId as number);

    // Validate that the QR type is allowed by the user's subscription plan
    if (req.auth?.userRole !== "ADMIN" && req.subscription?.plan) {
      const rawAllowedTypes = req.subscription.plan.allowedQRTypes;
      let allowedTypes: string[] = [];

      if (typeof rawAllowedTypes === "string") {
        try {
          allowedTypes = JSON.parse(rawAllowedTypes);
        } catch {
          allowedTypes = [];
        }
      } else if (Array.isArray(rawAllowedTypes)) {
        allowedTypes = rawAllowedTypes as string[];
      }

      if (allowedTypes.length > 0 && !allowedTypes.includes(qr.type)) {
        res.apiResponse(403, `QR type "${qr.type}" is not allowed on your current plan.`);
        return;
      }
    }

    const newQr = await createQR(qr, userId as number);
    res.apiResponse(201, "Qr create successfully", newQr);
  });

qrRouter.get("/type-counts", allowRoles("ADMIN", "USER"), async (req, res) => {
  const { folderId } = req.query;
  const userId = req.auth?.userRole === "ADMIN" ? undefined : req.auth?.userId!
  const data = await getQrTypesWithCount(
    folderId ? Number(folderId) : undefined,
    userId
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
  })
  .put(allowRoles("ADMIN"),
    async (req, res) => {
      const { id } = qrIdSchema.parse(req.params);
      const { isActive } = isActiveSchema.parse(req.body);
      await qrStatus(id, isActive);
      res.apiResponse(200, "Qr status Changed Succesfully");

    }
  )

qrRouter.get(
  "/folders/:folderId",
  allowRoles("ADMIN", "USER"),
  async (req, res) => {
    const query = listQRSchema.parse(req.query);
    const { folderId } = folderIdSchema.parse(req.params);
    const userId =
      req.auth?.userRole === "ADMIN"
        ? query.userId
        : Number(req.auth?.userId as number);
    const data = await listQRs({ ...query, userId }, folderId);
    res.apiResponse(200, null, data.data, data.meta);
  },
);
