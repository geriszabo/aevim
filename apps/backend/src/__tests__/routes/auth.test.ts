import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import app from "../../index";
import { createTestDb } from "../../test/test-db";
import {
  loginrequest,
  logoutRequest,
  signupRequest,
} from "../../test/test-request-helpers";
import { completeAuthFlow, loginAndReturn, logoutAndReturn, signupAndReturn } from "../../test/test-helpers";

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
    const { signupRes: secondRes, json } = await signupAndReturn();
    expect(secondRes.status).toBe(409);
    expect(json).toEqual({
      errors: ["Email address already exists"],
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
    const {cookie} = await completeAuthFlow()
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
    });
  });

  it("returns 401 if not authenticated", async () => {
    // No cookie
    const req = new Request("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });
});
