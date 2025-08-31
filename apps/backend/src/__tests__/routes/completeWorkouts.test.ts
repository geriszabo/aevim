import { addCompleteWorkoutRequest } from "../../test/test-request-helpers";
import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb, createTestUser } from "../../test/test-db";
import app from "../../index";
import {
  createCompleteWorkoutAndReturn,
  getAuthMeAndReturn,
  getWorkoutOverviewAndReturn,
  loginFlow,
} from "../../test/test-helpers";
import type { WorkoutOverview } from "@aevim/shared-types";



let db: Database;
let userId: string;

mock.module("../../db/db.ts", () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
  userId = createTestUser(db);
});
afterEach(() => {
  db.close();
});

const defaultCompleteWorkout: WorkoutOverview = {
  exercises: [
    {
      category: "chest",
      created_at: expect.any(String),
      exercise_id: expect.any(String),
      id: expect.any(String),
      metric: "weight",
      name: "Bench Press",
      order_index: 1,
      sets: [
        {
          created_at: expect.any(String),
          id: expect.any(String),
          metric_value: 135,
          order_index: 1,
          reps: 10,
          workout_exercise_id: expect.any(String),
        },
        {
          created_at: expect.any(String),
          id: expect.any(String),
          metric_value: 145,
          order_index: 2,
          reps: 8,
          workout_exercise_id: expect.any(String),
        },
      ],
      workout_id: expect.any(String),
    },
  ],
  workout: {
    created_at: expect.any(String),
    date: "2025-08-27",
    id: expect.any(String),
    name: "Monday Workout",
    notes: "Great session",
  },
};


describe("/completeWorkouts endpoint", () => {
  it("returns errors if no auth token is provided", async () => {
    await loginFlow();
    const req = addCompleteWorkoutRequest();
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });

  describe("POST /completeWorkouts", () => {
    it("creates a complete workout", async () => {
      const { cookie } = await loginFlow();
      const { res, completeWorkout } = await createCompleteWorkoutAndReturn(
        cookie!
      );
      expect(res.status).toBe(200);
      expect(completeWorkout).toEqual({
        message: "Complete workout created successfully",
        workout: {
         ...defaultCompleteWorkout
        },
      });
    });
  });
  describe("GET /completeWorkouts/:id", async () => {
    it("fetches a complete workout by ID", async () => {
      const { cookie } = await loginFlow();
      const { user } = await getAuthMeAndReturn(cookie!);
      if (!("id" in user)) return;
      const {
        res,
        completeWorkout: {
          workout: {
            workout: { id: completeWorkoutId },
          },
        },
      } = await createCompleteWorkoutAndReturn(cookie!);
      const { overview, overviewRes } = await getWorkoutOverviewAndReturn(
        cookie!,
        completeWorkoutId
      );
      expect(overviewRes.status).toBe(200);
      expect(overview).toEqual({
       ...defaultCompleteWorkout
      });
    });
  });
});
