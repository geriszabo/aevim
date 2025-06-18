import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import {
  createExerciseAddToWorkoutAndReturn,
  createSetAddToWorkoutAndReturn,
  createWorkoutAndReturn,
  getAllSetsByExerciseIdAndReturn,
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
  describe("POST /workouts/:workoutId/exercises/:exerciseId/sets", () => {
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
  describe("GET workouts/:workoutId/exercises/:exerciseId/sets", () => {
    it("returns sets of an exercise", async () => {
      const setsArray = [
        { distance: 1, duration: 1, notes: "cool", reps: 2, weight: 50 },
        { distance: 24, reps: 1, notes: "just a small jog" },
      ];
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { exercise, success } = await createExerciseAddToWorkoutAndReturn(
        cookie!,
        workout.id
      );

      if (success) {
        for (const set of setsArray) {
          await createSetAddToWorkoutAndReturn(
            cookie!,
            workout.id,
            exercise.exercise.id,
            set
          );
        }

        const { sets, setsRes, success } =
          await getAllSetsByExerciseIdAndReturn(
            cookie!,
            workout.id,
            exercise.exercise.id
          );
        if (success) {
          expect(setsRes.status).toBe(200);
          expect(sets.sets[0]).toEqual({
            id: expect.any(String),
            workout_exercise_id: expect.any(String),
            reps: 2,
            weight: 50,
            duration: 1,
            distance: 1,
            notes: "cool",
            order_index: 1,
            created_at: expect.any(String),
          });
          expect(sets.sets[1]).toEqual({
            id: expect.any(String),
            workout_exercise_id: expect.any(String),
            reps: 1,
            weight: 100,
            duration: 2,
            distance: 24,
            notes: "just a small jog",
            order_index: 2,
            created_at: expect.any(String),
          });
        }
      }
    });
    it("throws error if exercise id does not exist", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { sets, setsRes } = await getAllSetsByExerciseIdAndReturn(
        cookie!,
        workout.id,
        "fictionalExerciseId"
      );
      expect(setsRes.status).toBe(404);
      expect(sets).toEqual({ errors: ["Could not find exercise with set"] });
    });
  });
});
