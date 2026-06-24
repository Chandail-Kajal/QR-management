import express from "express";

import { redirect } from "./redirect.controller";

export const redirectRouter =
  express.Router();

redirectRouter.get(
  "/:token",
  redirect,
);