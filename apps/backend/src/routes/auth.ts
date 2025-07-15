import { Hono } from "hono";
import { signupValidator } from "../db/schemas/signup-schema";
import { dbConnect } from "../db/db";
import {
  getUserByEmail,
  getUserById,
  insertUser,
} from "../db/queries/auth-queries";
import {
  cookieOptions,
  generateTokenPair,
  handleError,
  refreshCookieOptions,
} from "../helpers";
import { deleteCookie, setCookie } from "hono/cookie";
import { loginValidator } from "../db/schemas/login-schema";

const auth = new Hono();

auth
  .post("/signup", signupValidator, async (c) => {
    const db = dbConnect();
    const { email, password, username } = c.req.valid("json");
    try {
      //Get userId
      const userId = await insertUser(db, email, password, username);
      //Generate both tokens
      const { accessToken, refreshToken } = await generateTokenPair(userId);
      //Set to cookie
      setCookie(c, "authToken", accessToken, cookieOptions);
      setCookie(c, "refreshToken", refreshToken, refreshCookieOptions);
      //Return success
      return c.json({
        message: "User registered successfully",
        user: { id: userId, email },
      });
    } catch (error) {
      //Return error
      return handleError(c, error);
    }
  })
  .post("/login", loginValidator, async (c) => {
    const db = dbConnect();
    const { email, password } = c.req.valid("json");
    try {
      const user = getUserByEmail(db, email);
      const passwordMatch = await Bun.password.verify(
        password,
        user.password_hash
      );

      if (!passwordMatch) {
        throw new Error("PASSWORD_MISMATCH");
      }

      const { accessToken, refreshToken } = await generateTokenPair(user.id);
      setCookie(c, "authToken", accessToken, cookieOptions);
      setCookie(c, "refreshToken", refreshToken, refreshCookieOptions);

      return c.json({
        message: "Login successful",
        user: { id: user.id, email },
      });
    } catch (error) {
      return handleError(c, error);
    }
  })
  .post("/logout", async (c) => {
    deleteCookie(c, "authToken", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      httpOnly: true,
    });
    deleteCookie(c, "refreshToken", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      httpOnly: true,
    });
    return c.json({ message: "Logout successful" }, 200);
  })
  .get("/auth/me", async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");

    if (payload.type !== "access") {
      return c.json({ errors: ["Invalid token type"] }, 401);
    }
    try {
      const user = getUserById(db, payload.sub);
      if (!user) {
        return c.json({ errors: ["User not found"] }, 404);
      }
      const { email, id, username } = user;
      return c.json({ id, email, username }, 200);
    } catch (error) {
      return handleError(c, error);
    }
  });

export default auth;
