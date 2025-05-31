import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";
import app from ".";
import { createTestDb } from "./test/test-db";
import { dbConnect } from "./db/db";
import {
  loginrequest,
  logoutRequest,
  signupRequest,
} from "./test/test-helpers";

let db: Database;

mock.module("../src/db/db.ts", () => {
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
    const req = signupRequest();
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: "User registered successfully",
      user: {
        id: expect.any(String),
        email: "test@test.com",
      },
    });
  });

  it("returns error if email or password are not present", async () => {
    const req = signupRequest("", "");
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual({
      errors: ["Invalid email", "Password must be at least 8 characters long"],
    });
  });

  it("returns a 409 if email already exists", async () => {
    const firstReq = signupRequest();
    const firstRes = await app.fetch(firstReq);
    expect(firstRes.status).toBe(200);
    const secondReq = signupRequest();
    const secondRes = await app.fetch(secondReq);
    const json = await secondRes.json();
    expect(secondRes.status).toBe(409);
    expect(json).toEqual({
      errors: ["Email address already exists"],
    });
  });
});

describe("/login endpoint", () => {
  it("logs the user in", async () => {
    const signupReq = signupRequest();
    await app.fetch(signupReq);
    const loginReq = loginrequest();
    const loginRes = await app.fetch(loginReq);
    const json = await loginRes.json();
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
    const signupReq = signupRequest();
    await app.fetch(signupReq);

    //Try logging in with wrong email
    const loginReqWrongEmail = loginrequest("doesntexist@gmail.com");
    const loginResWrongEmail = await app.fetch(loginReqWrongEmail);
    const jsonWrongEmail = await loginResWrongEmail.json();

    //Try logging in with wrong password
    const loginReqWrongPassword = loginrequest(
      "test@test.com",
      "invalidPassword:((("
    );
    const loginResWrongPassword = await app.fetch(loginReqWrongPassword);
    const jsonWrongPassword = await loginResWrongPassword.json();

    expect(loginResWrongEmail.status).toBe(401);
    expect(loginResWrongPassword.status).toBe(401);
    expect(jsonWrongEmail).toEqual({
      errors: ["Invalid credentials"],
    });
    expect(jsonWrongPassword).toEqual({
      errors: ["Password mismatch"],
    });
  });

  it("returns 400 if email or password are missing", async () => {
    signupRequest();
    const req = loginrequest("", "");
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual({
      errors: ["Invalid email", "Password must be at least 8 characters long"],
    });
  });
});

describe("/logout endpoint", () => {
  it("logs user out and deletes cookie", async () => {
    const signupReq = signupRequest();
    await app.fetch(signupReq);
    const loginReq = loginrequest();
    const loginRes = await app.fetch(loginReq);
    const loginCookies = loginRes.headers.get("set-cookie");
    expect(loginCookies).toMatch(/authToken=([^;]+)/);
    const logoutReq = logoutRequest();
    const logoutRes = await app.fetch(logoutReq);
    const logoutCookies = logoutRes.headers.get("set-cookie");
    expect(logoutCookies).toMatch(/authToken=;/);
  });
});

describe("/me endpoint", () => {
  it("returns the current user's id and email if authenticated", async () => {
    await app.fetch(signupRequest());
    const loginRes = await app.fetch(loginrequest());
    const cookie = loginRes.headers.get("set-cookie");
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
