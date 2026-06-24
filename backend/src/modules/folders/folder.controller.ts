import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as service from "./folder.service";

import {
  createFolderSchema,
  updateFolderSchema,
  folderIdSchema,
} from "./folder.validator";

export async function createFolder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body =
      createFolderSchema.parse(req.body);

    const folder =
      await service.createFolder(
        req.workspace!.id,
        body.name,
      );

    return res.status(201).json({
      message: "Folder created successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
}

export async function listFolders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const folders =
      await service.listFolders(
        req.workspace!.id,
      );

    return res.status(200).json({
      message: "Folders fetched successfully",
      data: folders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFolder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } =
      folderIdSchema.parse(req.params);

    const folder =
      await service.getFolder(
        id,
        req.workspace!.id,
      );

    return res.status(200).json({
      message: "Folder fetched successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFolder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } =
      folderIdSchema.parse(req.params);

    const body =
      updateFolderSchema.parse(req.body);

    const folder =
      await service.updateFolder(
        id,
        req.workspace!.id,
        body.name,
      );

    return res.status(200).json({
      message: "Folder updated successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFolder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } =
      folderIdSchema.parse(req.params);

    await service.deleteFolder(
      id,
      req.workspace!.id,
    );

    return res.status(200).json({
      message: "Folder deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}