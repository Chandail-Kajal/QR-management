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
  id: number;
  status: SubscriptionStatus;
  planId: number;
  startDate: Date;
  endDate: Date | null;
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
