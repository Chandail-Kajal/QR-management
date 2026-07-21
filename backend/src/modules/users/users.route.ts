import { allowRoles, auth } from "@/middlewares";
import { Router } from "express";
import * as UserController from "./users.controllers";
import { validate } from "@/middlewares/validate";
import {
  createUserSchema,
  listUsersSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./user.validations";
import { createUser } from "./users.controllers";

export const usersRouter = Router();

usersRouter.use(auth);
usersRouter.use(allowRoles("ADMIN"));

usersRouter
  .route("/")
  .all(allowRoles("ADMIN"))
  .get(async (req, res) => {
    const query = listUsersSchema.parse(req.query);
    const data = await UserController.getUsers(query);
    res.apiResponse(200, null, data.data, { pagination: data.meta.pagination });
  })
  .post(async (req, res) => {
    const body = createUserSchema.parse(req.body);
    const newUser = await createUser(body);
    res.apiResponse(201, null, newUser);
  });

usersRouter
  .route("/:id")
  .all(allowRoles("ADMIN"))
  .patch(async (req, res) => {
    const { id } = userIdParamSchema.parse(req.params);
    const body = updateUserSchema.parse(req.body);
    const updatedUser = await UserController.updateUser(id, body);
    res.apiResponse(200, null, updatedUser);
  })
  .delete(async (req, res) => {
    const { id } = userIdParamSchema.parse(req.params);
    const deletedUser = await UserController.deleteUser(id);
    res.apiResponse(200, null, deletedUser);
  });
