import { allowRoles, auth } from "@/middlewares";
import { Router } from "express";
import { createSubPlanSchema, listSubPlanSchema, planId, updateSubPlanSchema } from "./sub-plan.validations";
import { createSubPlan, deleteSubPlan, listSubPlan, updateSubPlan } from "./sub-plan.controller";

export const subPlanRouter = Router()

subPlanRouter.use(auth, allowRoles("ADMIN"))


subPlanRouter.route("/")
    .get(async (req, res) => {
        const { page, limit } = listSubPlanSchema.parse(req.query)
        const data = await listSubPlan({ page, limit })
        const plans = data.data.map(d => ({ ...d, allowedQRTypes: d.allowedQRTypes ? JSON.parse(d.allowedQRTypes as unknown as string) : [] }))
        res.apiResponse(200, null, plans, { pagination: data.meta })
    })
    .post(async (req, res) => {
        const body = createSubPlanSchema.parse(req.body)
        const newPlan = await createSubPlan(body)
        res.apiResponse(201, null, newPlan)
    })


subPlanRouter.route("/:id")
    .patch(async (req, res) => {
        const { id } = planId.parse(req.params)
        const body = updateSubPlanSchema.parse(req.body)
        const updated = await updateSubPlan(id, body)
        res.apiResponse(200, null, updated)
    })

    .delete(async (req, res) => {
        const { id } = planId.parse(req.params)
        const deleted = await deleteSubPlan(id)
        res.apiResponse(200, null, deleted.id)
    })