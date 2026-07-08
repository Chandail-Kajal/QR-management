import express from "express";

import {
  createFolder,
  listFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
  getFolderByName,
  getFolderOptions,
} from "./folder.controller";

import { auth, workspace, allowRoles } from "@/middlewares";

export const folderRouter = express.Router();

folderRouter.use(auth);
folderRouter.use(workspace);

folderRouter.get(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  listFolders,
);

folderRouter.get(
  "/options",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  getFolderOptions,
);

folderRouter.post(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER"),
  createFolder,
);

folderRouter.get(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  getFolderById,
);

folderRouter.get(
  "/by-name/:name",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER", "VIEWER"),
  getFolderByName,
);

folderRouter.patch(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER"),
  updateFolder,
);

folderRouter.delete(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN", "MEMBER"),
  deleteFolder,
);
