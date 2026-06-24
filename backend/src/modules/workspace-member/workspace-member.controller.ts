import type { Request, Response, NextFunction } from "express";

import * as service from "./workspace-member.service";

import {
  workspaceIdSchema,
  memberIdSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} from "./workspace-member.validator";

export async function listMembers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdSchema.parse(req.params);

    const members = await service.listMembers(workspaceId);

    return res.status(200).json({
      message: "Workspace members fetched successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
}

export async function addMember(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdSchema.parse(req.params);

    const body = addMemberSchema.parse(req.body);

    const member = await service.addMember(
      workspaceId,
      req.auth!.userId,
      body.userId,
      body.role,
    );

    return res.status(201).json({
      message: "Member added successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMemberRole(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdSchema.parse(req.params);

    const { memberId } = memberIdSchema.parse(req.params);

    const body = updateMemberRoleSchema.parse(req.body);

    const member = await service.updateMemberRole(
      workspaceId,
      req.auth!.userId,
      memberId,
      body.role,
    );

    return res.status(200).json({
      message: "Member role updated successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { workspaceId } = workspaceIdSchema.parse(req.params);

    const { memberId } = memberIdSchema.parse(req.params);

    await service.removeMember(
      workspaceId,
      req.auth!.userId,
      memberId,
    );

    return res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
}