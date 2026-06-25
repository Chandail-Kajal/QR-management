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

  const qrSeeds = [
    {
      token: "demo-url",
      name: "Website QR",
      type: "URL",
      content: {
        type: "URL",
        url: "https://google.com",
      },
    },

    {
      token: "demo-text",
      name: "Text QR",
      type: "TEXT",
      content: {
        type: "TEXT",
        text: "Welcome to Smart QR Platform",
      },
    },

    {
      token: "demo-email",
      name: "Email QR",
      type: "EMAIL",
      content: {
        type: "EMAIL",
        email: "support@example.com",
        subject: "Need Help",
        body: "Hello Team",
      },
    },

    {
      token: "demo-phone",
      name: "Phone QR",
      type: "PHONE",
      content: {
        type: "PHONE",
        phone: "+819012345678",
      },
    },

    {
      token: "demo-sms",
      name: "SMS QR",
      type: "SMS",
      content: {
        type: "SMS",
        phone: "+819012345678",
        message: "Hello from QR",
      },
    },

    {
      token: "demo-wifi",
      name: "WiFi QR",
      type: "WIFI",
      content: {
        type: "WIFI",
        ssid: "Office Wifi",
        password: "Password123",
        encryption: "WPA2",
        hidden: false,
      },
    },

    {
      token: "demo-file",
      name: "File QR",
      type: "FILE",
      content: {
        type: "FILE",
        fileId: 1,
        fileName: "brochure.pdf",
      },
    },

    {
      token: "demo-vcard",
      name: "vCard QR",
      type: "VCARD",
      content: {
        type: "VCARD",
        firstName: "Malkeet",
        lastName: "Kumar",
        company: "SaruCoder",
        title: "Founder",
        phone: "+819012345678",
        email: "malkeet@example.com",
        website: "https://sarucoder.com",
        address: "Chiba, Japan",
        note: "Building SaaS products.",
      },
    },

    {
      token: "demo-whatsapp",
      name: "WhatsApp QR",
      type: "WHATSAPP",
      content: {
        type: "WHATSAPP",
        phone: "819012345678",
        message: "Hello from QR",
      },
    },

    {
      token: "demo-google-review",
      name: "Google Review QR",
      type: "GOOGLE_REVIEW",
      content: {
        type: "GOOGLE_REVIEW",
        placeId: "sample-place-id",
        reviewUrl: "https://g.page/r/sample/review",
      },
    },

    {
      token: "demo-instagram",
      name: "Instagram QR",
      type: "INSTAGRAM",
      content: {
        type: "INSTAGRAM",
        username: "instagram",
        url: "https://instagram.com/instagram",
      },
    },

    {
      token: "demo-facebook",
      name: "Facebook QR",
      type: "FACEBOOK",
      content: {
        type: "FACEBOOK",
        pageName: "facebook",
        url: "https://facebook.com/facebook",
      },
    },

    {
      token: "demo-linkedin",
      name: "LinkedIn QR",
      type: "LINKEDIN",
      content: {
        type: "LINKEDIN",
        profileName: "linkedin",
        url: "https://linkedin.com",
      },
    },

    {
      token: "demo-x",
      name: "X QR",
      type: "X",
      content: {
        type: "X",
        username: "x",
        url: "https://x.com",
      },
    },

    {
      token: "demo-youtube",
      name: "YouTube QR",
      type: "YOUTUBE",
      content: {
        type: "YOUTUBE",
        channelName: "YouTube",
        url: "https://youtube.com",
      },
    },

    {
      token: "demo-tiktok",
      name: "TikTok QR",
      type: "TIKTOK",
      content: {
        type: "TIKTOK",
        username: "tiktok",
        url: "https://tiktok.com",
      },
    },

    {
      token: "demo-social",
      name: "Social Links QR",
      type: "SOCIAL",
      content: {
        type: "SOCIAL",
        title: "SaruCoder",
        description: "Follow us everywhere",
        links: {
          website: "https://sarucoder.com",
          instagram: "https://instagram.com",
          facebook: "https://facebook.com",
          linkedin: "https://linkedin.com",
          x: "https://x.com",
          youtube: "https://youtube.com",
          tiktok: "https://tiktok.com",
          whatsapp: "https://wa.me/819012345678",
        },
      },
    },
  ];

  for (const qr of qrSeeds) {
    await prisma.qR.upsert({
      where: {
        token: qr.token,
      },
      update: {},
      create: {
        token: qr.token,
        name: qr.name,
        type: qr.type as any,
        content: qr.content,
        workspaceId: workspace.id,
        createdById: admin.id,
      },
    });
  }

  console.log(`✅ Created ${qrSeeds.length} demo QR codes`);

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



  8