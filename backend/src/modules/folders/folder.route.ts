import express from "express";

import {
  createFolder,
  listFolders,
  getFolder,
  updateFolder,
  deleteFolder,
} from "./folder.controller";

import {
  auth,
  workspace,
  allowRoles,
} from "@/middlewares";

export const folderRouter =
  express.Router();

folderRouter.use(auth);
folderRouter.use(workspace);

folderRouter.get(
  "/",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ),
  listFolders,
);

folderRouter.post(
  "/",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
  ),
  createFolder,
);

folderRouter.get(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ),
  getFolder,
);

folderRouter.patch(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
  ),
  updateFolder,
);

folderRouter.delete(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "MEMBER",
  ),
  deleteFolder,
);