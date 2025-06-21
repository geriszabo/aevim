import { Hono } from "hono";
import { signupValidator } from "../db/schemas/signup-schema";
import { dbConnect } from "../db/db";
import {
  getUserByEmail,
  getUserById,
  insertUser,
} from "../db/queries/auth-queries";
import { cookieOptions, generateToken, handleError } from "../helpers";
import { deleteCookie, setCookie } from "hono/cookie";

const auth = new Hono();

auth
  .post("/signup", signupValidator, async (c) => {
    const db = dbConnect();
    const { email, password } = c.req.valid("json");
    try {
      //Get userId
      const userId = await insertUser(db, email, password);
      //Generate token
      const token = await generateToken(userId);
      //Set to cookie
      setCookie(c, "authToken", token, cookieOptions);
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
  .post("/login", signupValidator, async (c) => {
    const db = dbConnect();
    const { email, password } = c.req.valid("json");
    try {
      const user = getUserByEmail(db, email);
      if (!user) {
        return c.json({ errors: ["Invalid credentials"] }, 401);
      }
      const passwordMatch = await Bun.password.verify(
        password,
        user.password_hash
      );

      if (!passwordMatch) {
        throw new Error("PASSWORD_MISMATCH");
      }

      const token = await generateToken(user.id);
      setCookie(c, "authToken", token, cookieOptions);
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
    return c.json({ message: "Logout successful" }, 200);
  })
  .get("/auth/me", async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    try {
      const user = getUserById(db, payload.sub);
      if (!user) {
        return c.json({ errors: ["User not found"] }, 404);
      }
      const { email, id } = user;
      return c.json({ id, email }, 200);
    } catch (error) {
      return handleError(c, error);
    }
  });

export default auth;
