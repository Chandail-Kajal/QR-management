export interface TSubPlanDTO {
    id: number;
    name: string;
    description?: string | null;
    isFree: boolean;
    isActive: boolean;

    // Pricing & Duration
    price: number;
    currency: string;
    intervalType: "DAYS" | "MONTHS";
    intervalValue: number;

    // Resource Limits (null = Unlimited)
    maxQRCodes?: number | null;
    maxTotalScans?: number | null;
    maxScansPerQR?: number | null;
    maxFolders?: number | null;
    maxQRsPerFolder?: number | null;
    maxFileUploads?: number | null;
    maxFileSizeMb?: number | null;
    maxCampaigns?: number | null;

    // Feature Flags & Access
    allowedQRTypes: string[];
    analyticsHistoryDays?: number | null;
    allowCustomDesign: boolean;
    allowPasswordProtection: boolean;
    allowExpiryDate: boolean;

    // Timestamps (ISO strings or Date objects depending on your API serializer)
    createdAt: string;
    updatedAt: string;
}