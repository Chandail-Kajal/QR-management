import express from "express";

import { auth } from "@/middlewares";

import {
  listMembers,
  addMember,
  updateMemberRole,
  removeMember,
} from "./workspace-member.controller";

export const workspaceMemberRouter =
  express.Router({ mergeParams: true });

workspaceMemberRouter.use(auth);

workspaceMemberRouter.get("/", listMembers);

workspaceMemberRouter.post("/", addMember);

workspaceMemberRouter.patch(
  "/:memberId",
  updateMemberRole,
);

workspaceMemberRouter.delete(
  "/:memberId",
  removeMember,
);