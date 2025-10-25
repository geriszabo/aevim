import { verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import env from "../env";
import {
  cookieOptions,
  generateTokenPair,
  refreshCookieOptions,
} from "../helpers";
import type { Context, Next } from "hono";

/**
 * Authentication middleware that handles:
 * 1. Access token verification
 * 2. Automatic token refresh using refresh tokens
 * 3. Sets JWT payload in context for downstream handlers
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const accessToken = getCookie(c, "authToken");
  const refreshToken = getCookie(c, "refreshToken");

  // Verify access token
  if (accessToken) {
    try {
      const payload = await verify(accessToken, env.JWT_SECRET);
      if (payload.type === "access") {
        c.set("jwtPayload", payload);
        return next();
      }
    } catch {
      console.log("Access token invalid, trying refresh token");
    }
  }

  // If access token is invalid/missing, go with refresh token
  if (refreshToken) {
    try {
      const payload = await verify(refreshToken, env.REFRESH_TOKEN_SECRET);
      if (payload.type === "refresh") {
        console.log("Refreshing tokens for user:", payload.sub);

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateTokenPair(payload.sub as string);

        setCookie(c, "authToken", newAccessToken, cookieOptions);
        setCookie(c, "refreshToken", newRefreshToken, refreshCookieOptions);

        c.set("jwtPayload", { sub: payload.sub, type: "access" });

        console.log("Token refresh completed successfully");
        return next();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Refresh token invalid:", error.message);
      }
      console.log("SOMETHING WENT TERRIBLY WRONG WITH THE TOKENS ��");
    }
  }

  // Fallback if both tokens are invalid
  return c.json({ errors: ["Authentication required"] }, 401);
};
