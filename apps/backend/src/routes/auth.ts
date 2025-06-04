import { Hono } from "hono";
import { signupValidator } from "../db/schemas/signup-schema";
import { dbConnect } from "../db/db";
import { getUserByEmail, getUserById, insertUser } from "../db/queries/auth-queries";
import { cookieOptions, generateToken } from "../helpers";
import { deleteCookie, setCookie } from "hono/cookie";

const auth = new Hono();

auth
  .post("/signup", signupValidator, async (c) => {
    //Connect to db
    const db = dbConnect();
    //Get email and pass
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
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        return c.json({ errors: ["Email address already exists"] }, 409);
      } else {
        console.error(`Signup error: ${error}`);
        return c.json({ errors: ["Internal server error"] }, 500);
      }
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
        return c.json({ errors: ["Password mismatch"] }, 401);
      }
      const token = await generateToken(user.id);
      setCookie(c, "authToken", token, cookieOptions);
      return c.json({
        message: "Login successful",
        user: { id: user.id, email },
      });
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
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
      console.error("Error fetching user");
      return c.json({ error: "Internal server error" }, 500);
    }
  });

export default auth;
