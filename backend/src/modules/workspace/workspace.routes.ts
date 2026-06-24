import express from "express";

import { auth } from "@/middlewares";

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  listWorkspaces,
  updateWorkspace,
} from "./workspace.controller";

export const workspaceRouter = express.Router();

workspaceRouter.use(auth);

workspaceRouter.get("/", listWorkspaces);

workspaceRouter.post("/", createWorkspace);

workspaceRouter.get("/:id", getWorkspace);

workspaceRouter.patch("/:id", updateWorkspace);

workspaceRouter.delete("/:id", deleteWorkspace);