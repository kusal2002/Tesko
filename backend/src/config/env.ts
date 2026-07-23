import dotenv from "dotenv";

dotenv.config();

/**
 * Reads a required environment variable and fails fast (at startup) if it is
 * missing. This avoids shipping insecure fallback values (e.g. a default JWT
 * secret) into a running server.
 */
const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${key}. See backend/.env.example.`
    );
  }
  return value;
};

// A comma-separated CORS_ORIGIN lets a single backend serve both local
// development and a deployed frontend (e.g. "http://localhost:5173,https://app.netlify.app").
const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "24h",
  corsOrigins,
};
