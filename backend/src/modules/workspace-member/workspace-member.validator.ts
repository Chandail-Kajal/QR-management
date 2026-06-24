import { Role } from "@/generated/prisma/enums";
import { z } from "zod";

export const workspaceIdSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
});

export const memberIdSchema = z.object({
  memberId: z.coerce.number().int().positive(),
});

export const addMemberSchema = z.object({
  userId: z.number().int().positive(),
  role: z.nativeEnum(Role),
});

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(Role),
});