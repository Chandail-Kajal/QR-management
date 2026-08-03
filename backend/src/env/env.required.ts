export const REQUIRED_ENV: Record<string, string[]> = {
  development: ["DATABASE_URL","GEO_API"],

  test: ["DATABASE_URL","GEO_API"],

  production: ["DATABASE_URL", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET","GEO_API"],
};
