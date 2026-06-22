import { loadEnv } from "@/libs/env";
import { LogLevels } from "@/libs/logger";
const envFile = `.env.${process.env.NODE_ENV || "dev"}`;
const raw = loadEnv(envFile);

export const env = {
  IS_PRODUCTION: raw.NODE_ENV === "production" ? true : false,
  NODE_ENV: raw.NODE_ENV || "dev",
  PORT: Number(raw.PORT) || 3000,
  ALLOWED_ORIGINS: raw.ALLOWED_ORIGINS?.split(" ") || ["*"],
  ACCESS_TOKEN_SECRET: raw.ACCESS_TOKEN_SECRET || "ACCESSS_SECRET_V2",
  REFRESH_TOKEN_SECRET: raw.REFRESH_TOKEN_SECRET || "REFRESH_SECRET_V2",
  DATABASE_URL: raw.DATABASE_URL || "",
  LOG_LEVEL: (raw.LOG_LEVEL || "info") as LogLevels,
};
