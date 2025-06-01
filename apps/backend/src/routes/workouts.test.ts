import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../test/test-db";
import app from "../index";
import {
  addWorkoutRequest,
  loginrequest,
  logoutRequest,
  signupRequest,
  type AddWorkoutRequestProps,
} from "../test/test-helpers";
import { insertWorkout } from "../db/queries";

let db: Database;

mock.module("../db/db.ts", () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
});
afterEach(() => {
  db.close();
});

describe("/workouts endpoint", () => {
  async function loginFlow() {
    await app.fetch(signupRequest());
    const loginRes = await app.fetch(loginrequest());
    const cookie = loginRes.headers.get("Set-Cookie");
    return { loginRes, cookie };
  }
  it("creates a workout", async () => {
    const { cookie } = await loginFlow();
    const req = addWorkoutRequest({ cookie: cookie! });
    const res = await app.fetch(req);
    const json = await res.json();
    expect(cookie).toMatch(/authToken=([^;]+)/);
    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: "Workout created successfully",
      workout: {
        id: expect.any(String),
        user_id: expect.any(String),
        name: "crossfit session",
        date: "2022.08.25",
        created_at: expect.any(String),
        notes: "im dead",
      },
    });
  });

  it("returns errors if no auth token is provided", async () => {
    await loginFlow();
    const req = addWorkoutRequest({});
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 if parameters are invalid", async () => {
    const { cookie } = await loginFlow();
    const req = addWorkoutRequest({
      cookie: cookie!,
      date: null,
      name: null,
      notes: null,
      userId: null,
    } as unknown as AddWorkoutRequestProps);
    const res = await app.fetch(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toEqual({
      errors: [
        "You have to give the workout a name",
        "Expected string, received null",
        "Please pick a date for the workout",
      ],
    });
  });
});
