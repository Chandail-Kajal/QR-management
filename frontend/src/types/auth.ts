export type Role = "ADMIN" | "USER";

type SubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED";
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  allowCustomDesign: boolean;
  allowedQRTypes: string[];
  allowExpiryDate: boolean;
  allowPasswordProtection: boolean;
  analyticsHistoryDays: number;
  isFree: boolean;
  isActive: boolean;
  maxCampaigns: number;
  maxFileSizeMb: number;
  maxFileUploads: number;
  name: string;
  maxFolders: number;
  maxQRCodes: number;
  maxQRsPerFolder: number;
  maxScansPerQR: number;
  maxTotalScans: number;
  startDate: Date;
  expiryDate: Date;
  subscriptionStatus: SubscriptionStatus;
}

export interface ILoginResponseDTO {
  user: AuthUser;
  subscription: UserSubscription | null;
  accessToken: string;
}

export interface ILoginRequestDTO {
  email: string;
  password: string;
  remember?: boolean;
}

export interface IRefreshTokenResponseDTO {
  accessToken: string;
}
