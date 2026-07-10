import { allowRoles, auth } from "@/middlewares";
import { Router } from "express";
import * as UserController from "./users.controller"
import { validate } from "@/middlewares/validate";
import { createUserSchema, listUsersSchema, updateUserSchema } from "./user.validations";

export const usersRouter = Router()


usersRouter.use(auth)
usersRouter.use(allowRoles("SUPER_ADMIN", "ADMIN"))

usersRouter.route("/")
    .get(validate(listUsersSchema, "query"), UserController.listUsers)
    .post(validate(createUserSchema, "body"), UserController.createUser)
    .patch(validate(updateUserSchema, "body"), UserController.updateUser)

usersRouter.delete("/:id", UserController.deleteUser)