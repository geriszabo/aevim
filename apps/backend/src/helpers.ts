import { Database } from "bun:sqlite";
import { sign } from "hono/jwt";
import type { CookieOptions } from "hono/utils/cookie";
import env from "./env";
import type { Context } from "hono";

type ErrorCode = keyof typeof ERROR_MAPPINGS;

export const createTable = (
  dbInstance: Database,
  tableName: string,
  schema: string
) => {
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
    ${schema}
    )
    `);
};

export const generateToken = async (userId: string) => {
  const secret = env.JWT_SECRET;
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: userId,
    iat: now, //IssuedAtTime
    exp: now + 1 * 60 * 60, //expires in 1 hour
  };

  const token = await sign(payload, secret);
  return token;
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax", // or Strict
  path: "/",
  maxAge: 3600, //1 hour
};

const ERROR_MAPPINGS = {
  // Exercise errors
  EXERCISE_NOT_FOUND: { status: 404, message: "Exercise not found" },
  NO_EXERCISES_FOUND: { status: 404, message: "No exercises found" },
  // Workout errors
  WORKOUT_NOT_FOUND: { status: 404, message: "Workout not found" },
  WORKOUT_EXERCISE_NOT_FOUND: {
    status: 404,
    message: "Workout exercise not found",
  },
  // Set errors
  SET_NOT_FOUND: { status: 404, message: "Set not found" },
  // Auth errors
  USER_NOT_FOUND: { status: 404, message: "User not found" },
  EMAIL_ALREADY_EXISTS: {
    status: 409,
    message: "Email address already exists",
  },
  INVALID_CREDENTIALS: { status: 401, message: "Invalid credentials" },
  PASSWORD_MISMATCH: { status: 401, message: "Password mismatch" },
} as const;

export const handleError = (
  c: Context,
  error: unknown,
  fallbackMessage = "Internal server error"
) => {
  if (error instanceof Error) {
    const errorCode = error.message as ErrorCode;

    if (ERROR_MAPPINGS[errorCode]) {
      const { status, message } = ERROR_MAPPINGS[errorCode];
      return c.json({ errors: [message] }, status);
    }
  }

  return c.json({ errors: [fallbackMessage] }, 500);
};
