import type { Request, Response, NextFunction } from "express";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
} from "./workspace.validator";

import * as service from "./workspace.service";

export async function createWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = createWorkspaceSchema.parse(req.body);

    const workspace = await service.createWorkspace(
      req.auth!.userId as number,
      body,
    );

    return res.status(201).json({
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function listWorkspaces(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaces = await service.listWorkspaces(
      req.auth!.userId as number,
    );

    return res.status(200).json({
      message: "Workspaces fetched successfully",
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = workspaceIdSchema.parse(req.params);

    const workspace = await service.getWorkspace(
      id,
      req.auth!.userId as number,
    );

    return res.status(200).json({
      message: "Workspace fetched successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = workspaceIdSchema.parse(req.params);

    const body = updateWorkspaceSchema.parse(req.body);

    const workspace = await service.updateWorkspace(
      id,
      req.auth!.userId as number,
      body,
    );

    return res.status(200).json({
      message: "Workspace updated successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = workspaceIdSchema.parse(req.params);

    await service.deleteWorkspace(
      id,
      req.auth!.userId as number,
    );

    return res.status(200).json({
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}