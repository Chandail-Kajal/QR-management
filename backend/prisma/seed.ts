import {
  PrismaClient,
  Role,
  QRType,
  QRStatus,
  PlanInterval,
  SubscriptionStatus,
  AccountStatus,
} from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Password Hash
  const password = await bcrypt.hash("Admin@123", 10);

  // 2. Create System Admin
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {
      role: Role.ADMIN,
    },
    create: {
      name: "System Administrator",
      email: "admin@example.com",
      password,
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
    },
  });

  console.log("✅ Admin user created/verified");

  // 3. Create Default Subscription Plans
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Free Plan",
      description: "Basic plan with limited scans and QR codes.",
      isFree: true,
      price: 0,
      currency: "USD",
      intervalType: PlanInterval.MONTHS,
      intervalValue: 1,
      maxQRCodes: 5,
      maxTotalScans: 500,
      maxScansPerQR: 100,
      maxFolders: 2,
      maxCampaigns: 1,
      allowedQRTypes: JSON.stringify(["URL", "TEXT", "WIFI"]),
      allowCustomDesign: true,
      allowPasswordProtection: false,
      allowExpiryDate: false,
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: "Pro Monthly",
      description: "Unlimited access to all feature types and custom styling.",
      isFree: false,
      price: 19.99,
      currency: "USD",
      intervalType: PlanInterval.MONTHS,
      intervalValue: 1,
      maxQRCodes: null, // Unlimited
      maxTotalScans: null, // Unlimited
      maxScansPerQR: null,
      maxFolders: 50,
      maxCampaigns: 20,
      allowedQRTypes: JSON.stringify(Object.values(QRType)),
      allowCustomDesign: true,
      allowPasswordProtection: true,
      allowExpiryDate: true,
    },
  });

  console.log("✅ Default Subscription Plans created");

  // 4. Assign Pro Subscription to Admin
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  await prisma.subscription.upsert({
    where: { id: 1 },
    update: {
      status: SubscriptionStatus.ACTIVE,
    },
    create: {
      id: 1,
      userId: admin.id,
      planId: proPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: oneYearFromNow,
    },
  });

  console.log("✅ Admin Pro Subscription activated");

  // 5. Create Sample Folders & Campaigns
  const marketingFolder = await prisma.folder.upsert({
    where: {
      userId_name: {
        userId: admin.id,
        name: "Marketing Materials",
      },
    },
    update: {},
    create: {
      name: "Marketing Materials",
      userId: admin.id,
    },
  });

  const socialFolder = await prisma.folder.upsert({
    where: {
      userId_name: {
        userId: admin.id,
        name: "Social Profiles",
      },
    },
    update: {},
    create: {
      name: "Social Profiles",
      userId: admin.id,
    },
  });

  const launchCampaign = await prisma.campaign.create({
    data: {
      name: "2026 Product Launch",
      description: "Q3 Marketing Drive",
      userId: admin.id,
    },
  });

  console.log("✅ Sample Folders and Campaigns created");

  // 6. Seed QR Codes & Designs
  const qrSeeds = [
    {
      token: "demo-url",
      name: "Website QR",
      type: QRType.URL,
      folderId: marketingFolder.id,
      campaignId: launchCampaign.id,
      content: { type: "URL", url: "https://google.com" },
      design: { foregroundColor: "#000000", backgroundColor: "#FFFFFF" },
    },
    {
      token: "demo-text",
      name: "Text QR",
      type: QRType.TEXT,
      content: { type: "TEXT", text: "Welcome to Smart QR Platform" },
      design: { foregroundColor: "#1E3A8A", backgroundColor: "#F3F4F6" },
    },
    {
      token: "demo-email",
      name: "Email QR",
      type: QRType.EMAIL,
      content: {
        type: "EMAIL",
        email: "support@example.com",
        subject: "Need Help",
        body: "Hello Team",
      },
      design: { foregroundColor: "#047857", backgroundColor: "#ECFDF5" },
    },
    {
      token: "demo-phone",
      name: "Phone QR",
      type: QRType.PHONE,
      content: { type: "PHONE", phone: "+819012345678" },
      design: { foregroundColor: "#B91C1C", backgroundColor: "#FEF2F2" },
    },
    {
      token: "demo-sms",
      name: "SMS QR",
      type: QRType.SMS,
      content: {
        type: "SMS",
        phone: "+819012345678",
        message: "Hello from QR",
      },
      design: { foregroundColor: "#6D28D9", backgroundColor: "#F5F3FF" },
    },
    {
      token: "demo-wifi",
      name: "WiFi QR",
      type: QRType.WIFI,
      content: {
        type: "WIFI",
        ssid: "Office Wifi",
        password: "Password123",
        encryption: "WPA2",
        hidden: false,
      },
      design: { foregroundColor: "#4338CA", backgroundColor: "#EEF2FF" },
    },
    {
      token: "demo-vcard",
      name: "vCard QR",
      type: QRType.VCARD,
      folderId: marketingFolder.id,
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
      design: { foregroundColor: "#1F2937", backgroundColor: "#F9FAFB" },
    },
    {
      token: "demo-whatsapp",
      name: "WhatsApp QR",
      type: QRType.WHATSAPP,
      content: {
        type: "WHATSAPP",
        phone: "819012345678",
        message: "Hello from QR",
      },
      design: { foregroundColor: "#15803D", backgroundColor: "#F0FDF4" },
    },
    {
      token: "demo-google-review",
      name: "Google Review QR",
      type: QRType.GOOGLE_REVIEW,
      content: {
        type: "GOOGLE_REVIEW",
        placeId: "sample-place-id",
        reviewUrl: "https://g.page/r/sample/review",
      },
      design: { foregroundColor: "#D97706", backgroundColor: "#FFFBEB" },
    },
    {
      token: "demo-instagram",
      name: "Instagram QR",
      type: QRType.INSTAGRAM,
      folderId: socialFolder.id,
      content: {
        type: "INSTAGRAM",
        username: "instagram",
        url: "https://instagram.com/instagram",
      },
      design: { foregroundColor: "#C13584", backgroundColor: "#FAFAFA" },
    },
    {
      token: "demo-facebook",
      name: "Facebook QR",
      type: QRType.FACEBOOK,
      folderId: socialFolder.id,
      content: {
        type: "FACEBOOK",
        pageName: "facebook",
        url: "https://facebook.com/facebook",
      },
      design: { foregroundColor: "#1877F2", backgroundColor: "#FFFFFF" },
    },
    {
      token: "demo-social",
      name: "Social Links QR",
      type: QRType.SOCIAL,
      folderId: socialFolder.id,
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
      design: { foregroundColor: "#111827", backgroundColor: "#F3F4F6" },
    },
  ];

  for (const qr of qrSeeds) {
    const createdQr = await prisma.qR.upsert({
      where: {
        token: qr.token,
      },
      update: {
        name: qr.name,
        type: qr.type,
        content: qr.content,
      },
      create: {
        token: qr.token,
        name: qr.name,
        type: qr.type,
        content: qr.content,
        userId: admin.id,
        folderId: qr.folderId ?? null,
        campaignId: qr.campaignId ?? null,
        status: QRStatus.ACTIVE,
      },
    });

    // Create or update QRDesign for this QR Code
    await prisma.qRDesign.upsert({
      where: {
        qrId: createdQr.id,
      },
      update: {
        foregroundColor: qr.design.foregroundColor,
        backgroundColor: qr.design.backgroundColor,
      },
      create: {
        qrId: createdQr.id,
        foregroundColor: qr.design.foregroundColor,
        backgroundColor: qr.design.backgroundColor,
      },
    });
  }

  console.log(
    `✅ Created ${qrSeeds.length} demo QR codes with design settings`,
  );

  console.log(`
=================================
Bootstrap completed successfully!
=================================

Admin Login Details:
- Email: admin@example.com
- Password: Admin@123
- Role: ADMIN
- Active Plan: Pro Monthly
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
