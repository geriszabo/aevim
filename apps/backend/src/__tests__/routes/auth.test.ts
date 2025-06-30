import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import app from "../../index";
import { createTestDb } from "../../test/test-db";
import {
  completeAuthFlow,
  getAuthMeAndReturn,
  loginAndReturn,
  logoutAndReturn,
  signupAndReturn,
} from "../../test/test-helpers";

let db: Database;

mock.module("../../db/db.ts", () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
});
afterEach(() => {
  db.close();
});

describe("/signup endpoint", () => {
  it("signs up a user", async () => {
    const { signupRes, json } = await signupAndReturn();

    expect(signupRes.status).toBe(200);
    expect(json).toEqual({
      message: "User registered successfully",
      user: {
        id: expect.any(String),
        email: "test@test.com",
      },
    });
  });

  it("returns error if email or password are not present", async () => {
    const { signupRes, json } = await signupAndReturn("", "");
    expect(signupRes.status).toBe(400);
    expect(json).toEqual({
      errors: ["Invalid email", "Password must be at least 8 characters long"],
    });
  });

  it("returns a 409 if email already exists", async () => {
    const { signupRes: firstRes } = await signupAndReturn();
    expect(firstRes.status).toBe(200);
    const { signupRes: secondRes, json } = await signupAndReturn(
      "test@test.com",
      "password123",
      "secondUsername"
    );
    expect(secondRes.status).toBe(409);
    expect(json).toEqual({
      errors: ["Email address already exists"],
    });
  });
  it("returns a 409 if username already exists", async () => {
    const { signupRes: firstRes } = await signupAndReturn();
    expect(firstRes.status).toBe(200);
    const { signupRes: secondRes, json } = await signupAndReturn(
      "differenttest@test.com",
      "password123",
      "testuser69"
    );
    expect(secondRes.status).toBe(409);
    expect(json).toEqual({
      errors: ["Username already exists"],
    });
  });
});

describe("/login endpoint", () => {
  it("logs the user in", async () => {
    await signupAndReturn();
    const { loginRes, json } = await loginAndReturn();

    expect(loginRes.status).toBe(200);
    expect(json).toEqual({
      message: "Login successful",
      user: {
        id: expect.any(String),
        email: "test@test.com",
      },
    });
  });

  it("throws 401 if credentials dont match", async () => {
    await signupAndReturn();
    // Try logging in with wrong email
    const { loginRes: wrongEmailRes, json: wrongEmailJson } =
      await loginAndReturn("doesntexist@gmail.com");

    // Try logging in with wrong password
    const { loginRes: wrongPasswordRes, json: wrongPasswordJson } =
      await loginAndReturn("test@test.com", "invalidPassword:(((");

    expect(wrongEmailRes.status).toBe(401);
    expect(wrongPasswordRes.status).toBe(401);
    expect(wrongEmailJson).toEqual({
      errors: ["Invalid credentials"],
    });
    expect(wrongPasswordJson).toEqual({
      errors: ["Password mismatch"],
    });
  });

  it("returns 400 if email or password are missing", async () => {
    const { loginRes, json } = await loginAndReturn("", "");
    expect(loginRes.status).toBe(400);
    expect(json).toEqual({
      errors: ["Invalid email", "Password must be at least 8 characters long"],
    });
  });
});

describe("/logout endpoint", () => {
  it("logs user out and deletes cookie", async () => {
    const { cookie: loginCookie } = await completeAuthFlow();
    expect(loginCookie).toMatch(/authToken=([^;]+)/);
    const { cookie: logoutCookie } = await logoutAndReturn();
    expect(logoutCookie).toMatch(/authToken=;/);
  });
});

describe("/me endpoint", () => {
  it("returns the current user's id and email if authenticated", async () => {
    const { cookie } = await completeAuthFlow();
    expect(cookie).toMatch(/authToken=([^;]+)/);
    const req = new Request("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
      headers: {
        Cookie: cookie!,
      },
    });
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({
      id: expect.any(String),
      email: "test@test.com",
      username: "testuser69",
    });
  });

  it("returns 401 if not authenticated", async () => {
    const req = new Request("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });
});

describe("/auth/me endpoint", () => {
  it("returns user data for authenticated user", async () => {
    const email = "test@test.com";
    const { cookie } = await completeAuthFlow(email);

    const { authMeRes, user, success } = await getAuthMeAndReturn(cookie!);

    expect(authMeRes.status).toBe(200);
    expect(success).toBe(true);
    if (success) {
      expect(user).toEqual({
        id: expect.any(String),
        email: email,
        username: "testuser69",
      });
      expect(user.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    }
  });

  it("returns 401 when no auth token provided", async () => {
    const { authMeRes, user, success } = await getAuthMeAndReturn("");

    expect(authMeRes.status).toBe(401);
    expect(success).toBe(false);
    if (!success) {
      expect(user.errors).toBeDefined();
    }
  });

  it("returns 401 when invalid auth token provided", async () => {
    const { authMeRes, user, success } = await getAuthMeAndReturn(
      "authToken=invalid.jwt.token"
    );

    expect(authMeRes.status).toBe(401);
    expect(success).toBe(false);
    if (!success) {
      expect(user.errors).toBeDefined();
    }
  });

  it("returns correct user data for different users", async () => {
    const user1Email = "user1@test.com";
    const user2Email = "user2@test.com";

    const { cookie: cookie1 } = await completeAuthFlow(user1Email);
    const { cookie: cookie2 } = await completeAuthFlow(
      user2Email,
      "password123",
      "differentTestuser"
    );

    const {
      authMeRes: res1,
      user: user1,
      success: success1,
    } = await getAuthMeAndReturn(cookie1!);
    const {
      authMeRes: res2,
      user: user2,
      success: success2,
    } = await getAuthMeAndReturn(cookie2!);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(success1).toBe(true);
    expect(success2).toBe(true);

    if (success1 && success2) {
      expect(user1.email).toBe(user1Email);
      expect(user2.email).toBe(user2Email);
      expect(user1.id).not.toBe(user2.id);
    }
  });

  it("does not return sensitive data", async () => {
    const { cookie } = await completeAuthFlow();
    const { authMeRes, user, success } = await getAuthMeAndReturn(cookie!);
    expect(authMeRes.status).toBe(200);
    expect(success).toBe(true);
    if (success) {
      expect(user).not.toHaveProperty("password");
      expect(user).not.toHaveProperty("password_hash");
      expect(user).toEqual({
        id: expect.any(String),
        email: expect.any(String),
        username: "testuser69",
      });
    }
  });
});
