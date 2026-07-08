import type { Request, Response, NextFunction } from "express";

import * as service from "./folder.service";

import {
  createFolderSchema,
  updateFolderSchema,
  folderIdSchema,
} from "./folder.validator";
import { ApiError } from "@/shared/utils";
import { prisma } from "@/config/prisma";

export async function createFolder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = createFolderSchema.parse(req.body);
    const folder = await service.createFolder(req.workspace!.id, body.name);
    return res.status(201).json({
      message: "Folder created successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFolderOptions(req: Request, res: Response, next: NextFunction) {
  try {
    const { search = "" } = req.query
    const folders = await prisma.folder.findMany({
      where: {
        name: {
          contains: search as string,
          mode: "insensitive" as const,
        },
      },
      select: {
        name: true,
        id: true
      },
      take: 10,
    })
    const folderOptions = folders.map(f => ({ label: f.name, value: f.id }))
    res.status(200).json({ data: folderOptions, message: "Options fetched successfully." })
  } catch (error) {
    next(error)
  }
}

export async function listFolders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { limit, page, search } = req.query as {
      limit: string;
      page: string;
      search: string;
    };
    const folders = await service.listFolders(
      { page: Number(page || 1), limit: Number(limit || 10) },
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

export async function getFolderById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = folderIdSchema.parse(req.params);

    const folder = await service.getFolder(id, req.workspace!.id);

    return res.status(200).json({
      message: "Folder fetched successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFolderByName(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.params;
    if (!name) throw new ApiError(404, "Folder does not exists");
    const folder = await service.getFolderByName(
      name as string,
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
    const { id } = folderIdSchema.parse(req.params);

    const body = updateFolderSchema.parse(req.body);

    const folder = await service.updateFolder(id, req.workspace!.id, body.name);

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
    const { id } = folderIdSchema.parse(req.params);

    await service.deleteFolder(id, req.workspace!.id);

    return res.status(200).json({
      message: "Folder deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
