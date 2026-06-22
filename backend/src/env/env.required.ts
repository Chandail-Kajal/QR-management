export const REQUIRED_ENV: Record<string, string[]> = {
  development: ["DATABASE_URL"],

  test: ["DATABASE_URL"],

  production: ["DATABASE_URL", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"],
};
