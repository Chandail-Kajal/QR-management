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

import { auth, allowRoles } from "@/middlewares";
import {
  createFolderSchema,
  folderIdSchema,
  folderNameSchema,
  folderOptionQuery,
  listFoldersSchema,
  updateFolderSchema,
} from "./folder.validator";

export const folderRouter = express.Router();

folderRouter.use(auth);

folderRouter
  .route("/")
  .all(allowRoles("ADMIN", "USER"))
  .get(async (req, res) => {
    const query = listFoldersSchema.parse(req.query);
    const userId =
      req.auth?.userRole === "ADMIN" ? undefined : req.auth?.userId;
    const data = await listFolders(query, userId);
    res.apiResponse(201, null, data.data, { pagination: data.meta.pagination });
  })
  .post(async (req, res) => {
    const body = createFolderSchema.parse(req.body);
    const newFolder = await createFolder({
      ...body,
      userId: req.auth?.userId as number,
    });
    res.apiResponse(200, null, newFolder);
  });

folderRouter
  .route("/:id")
  .all(allowRoles("ADMIN", "USER"))
  .get(async (req, res) => {
    const { id } = folderIdSchema.parse(req.params);
    const data = await getFolderById(id);
    res.apiResponse(200, null, data);
  })
  .patch(async (req, res) => {
    const body = updateFolderSchema.parse(req.body);
    const { id } = folderIdSchema.parse(req.params);
    const updatedFolder = await updateFolder(id, {
      ...body,
      userId: req.auth?.userId as number,
    });
    res.apiResponse(200, null, updatedFolder);
  })
  .delete(async (req, res) => {
    const { id } = folderIdSchema.parse(req.params);
    const folder = await deleteFolder(id, req.auth?.userId as number);
    res.apiResponse(200, null, folder);
  });

folderRouter.get("/options", allowRoles("ADMIN", "USER"), async (req, res) => {
  const { search } = folderOptionQuery.parse(req.query);
  const options = await getFolderOptions(search);
  res.apiResponse(200, null, options);
});

folderRouter.get(
  "/by-name/:name",
  allowRoles("ADMIN", "USER"),
  async (req, res) => {
    const { name } = folderNameSchema.parse(req.params);
    const folder = await getFolderByName(name);
    res.apiResponse(200, null, folder);
  },
);
