import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { insertWorkout } from "../../db/queries/workout-queries";
import { createTestDb } from "../../test/test-db";
import { Database } from "bun:sqlite";
import { insertExerciseToWorkout } from "../../db/queries/workout-exercises-queries";
import {
  getAllSetsByExerciseId,
  insertSet,
} from "../../db/queries/set-queries";
import type { SetData } from "../../types/set";

let db: Database;
const userId = "userId1";
const workoutData = {
  name: "Test Workout",
  date: "2023-10-01",
  notes: "This is a test workout",
};
const exerciseData = {
  name: "Push Up",
  category: "Strength",
};
const setData: SetData = { reps: 4, weight: 20, notes: "felt pretty good" };

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

describe("insertSet", () => {
  const setData: SetData = { reps: 4, weight: 20, notes: "felt pretty good" };
  it("inserts a set", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const set = insertSet(db, setData, userId, workout.id, exercise.id);
    expect(set).toEqual({
      id: expect.any(String),
      workout_exercise_id: expect.any(String),
      created_at: expect.any(String),
      reps: 4,
      weight: 20,
      duration: null,
      order_index: 1,
      distance: null,
      notes: "felt pretty good",
    });
  });

  it("throws if workout_exercise does not exist", () => {
    try {
      insertSet(
        db,
        { reps: 5, weight: 10 },
        userId,
        "fakeWorkoutId",
        "fakeExerciseId"
      );
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/WORKOUT_EXERCISE_NOT_FOUND/);
      }
    }
  });

  it("increments order_index for multiple sets", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const set1 = insertSet(db, setData, userId, workout.id, exercise.id);
    const set2 = insertSet(db, setData, userId, workout.id, exercise.id);
    expect(set1.order_index).toBe(1);
    expect(set2.order_index).toBe(2);
  });
});

describe("getAllSetsByExerciseId", () => {
  it("returns all sets of an exercise", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    insertSet(db, setData, userId, workout.id, exercise.id);
    insertSet(
      db,
      { reps: 1, distance: 20, notes: "I ran 20kms" },
      userId,
      workout.id,
      exercise.id
    );
    const sets = getAllSetsByExerciseId(db, userId, workout.id, exercise.id);
    expect(sets).toHaveLength(2);
    expect(sets![0]).toEqual({
      id: expect.any(String),
      workout_exercise_id: expect.any(String),
      reps: 4,
      weight: 20,
      distance: null,
      duration: null,
      notes: "felt pretty good",
      order_index: 1,
      created_at: expect.any(String),
    });
    expect(sets![1]).toEqual({
      id: expect.any(String),
      workout_exercise_id: expect.any(String),
      reps: 1,
      weight: null,
      distance: 20,
      duration: null,
      notes: "I ran 20kms",
      order_index: 2,
      created_at: expect.any(String),
    });
  });

  it("throws error if exercise doesnt exist", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    try {
      getAllSetsByExerciseId(db, userId, workout.id, "fictionalExerciseId");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/WORKOUT_EXERCISE_NOT_FOUND/);
      }
    }
  });
});
