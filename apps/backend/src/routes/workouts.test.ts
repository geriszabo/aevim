import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../test/test-db";
import app from "../index";
import {
  addWorkoutRequest,
  getWorkoutsRequest,
  loginrequest,
  logoutRequest,
  signupRequest,
  type AddWorkoutRequestProps,
} from "../test/test-helpers";
import { insertWorkout} from "../db/queries";
import type { Workout } from "@aevim/shared-types";
import type { WorkoutWithoutUserId } from "../types/workout";

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

  it("returns errors if no auth token is provided", async () => {
    await loginFlow();
    const req = addWorkoutRequest({});
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });

  describe("POST /workouts", () => {
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
          name: "crossfit session",
          date: "2022.08.25",
          created_at: expect.any(String),
          notes: "im dead",
        },
      });
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

  describe("GET /workouts", () => {
    const userId = "szabogeri69";
    it("returns all workouts for the authenticated user", async () => {
      const { cookie } = await loginFlow();

      await app.fetch(addWorkoutRequest({ cookie: cookie! }));
      await app.fetch(addWorkoutRequest({ cookie: cookie! }));

      const req = getWorkoutsRequest(userId, cookie!);
      const res = await app.fetch(req);
      const json = (await res.json()) as { workouts: WorkoutWithoutUserId[] };

      expect(res.status).toBe(200);
      expect(json.workouts).toHaveLength(2);
      json.workouts.forEach((workout) => {
        expect(workout).toEqual({
          id: expect.any(String),
          name: "crossfit session",
          notes: "im dead",
          date: "2022.08.25",
          created_at: expect.any(String),
        });
      });
    });

    it("returns an empty array if user has no workouts", async () => {
      const { cookie } = await loginFlow();

      const req = getWorkoutsRequest(userId, cookie!);
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        workouts: [],
      });
    });
  });
});
