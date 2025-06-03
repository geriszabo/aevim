import { Database } from "bun:sqlite";
import { sign } from "hono/jwt";
import type { CookieOptions } from "hono/utils/cookie";
import env from "./env";

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
