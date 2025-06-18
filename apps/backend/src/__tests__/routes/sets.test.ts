import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import app from "../../index";
import {
  createExerciseAddToWorkoutAndReturn,
  createSetAddToWorkoutAndReturn,
  createWorkoutAndReturn,
  loginFlow,
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

describe("/sets endpoint", () => {
  describe("POST /sets", () => {
    it("creates a set for an exercise", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { exercise, success } = await createExerciseAddToWorkoutAndReturn(
        cookie!,
        workout.id
      );
      if (success) {
        const { set, setRes } = await createSetAddToWorkoutAndReturn(
          cookie!,
          workout.id,
          exercise.exercise.id,
          { distance: 1, duration: 1, notes: "cool", reps: 2, weight: 50 }
        );
        expect(setRes.status).toBe(201);
        expect(set).toEqual({
          message: "Set added to exercise successfully",
          set: {
            id: expect.any(String),
            workout_exercise_id: expect.any(String),
            reps: 2,
            weight: 50,
            duration: 1,
            distance: 1,
            notes: "cool",
            order_index: 1,
            created_at: expect.any(String),
          },
        });
      }
    });

    it("returns 404 exercise is not found", async () => {
      const { cookie } = await loginFlow();
      const { set, setRes } = await createSetAddToWorkoutAndReturn(
        cookie!,
        "fictionalWorkoutId",
        "fictionalExerciseId",
        { distance: 1, duration: 1, notes: "cool", reps: 2, weight: 50 }
      );
      expect(setRes.status).toBe(404);
      expect(set).toEqual({ errors: ["Workout exercise not found"] });
    });
  });
});
