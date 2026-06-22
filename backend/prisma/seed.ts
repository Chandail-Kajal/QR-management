import { PrismaClient, Role } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const password = await bcrypt.hash("Admin@123", 10);

  // Create Super Admin
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@example.com",
      password,
    },
  });

  console.log("✅ Super Admin created");

  // Create System Workspace
  const workspace = await prisma.workspace.upsert({
    where: {
      slug: "system",
    },
    update: {},
    create: {
      name: "System Workspace",
      slug: "system",
      createdById: admin.id,
    },
  });

  console.log("✅ System Workspace created");

  // Assign Super Admin role
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: admin.id,
      },
    },
    update: {
      role: Role.SUPER_ADMIN,
    },
    create: {
      workspaceId: workspace.id,
      userId: admin.id,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("✅ Super Admin membership created");

  console.log(`
=================================
Bootstrap completed successfully
=================================

Admin Login
Email: admin@example.com
Password: Admin@123

Workspace:
- System Workspace
- Role: SUPER_ADMIN
`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
