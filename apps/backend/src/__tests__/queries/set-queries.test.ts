import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { insertWorkout } from "../../db/queries/workout-queries";
import { createTestDb } from "../../test/test-db";
import { Database } from "bun:sqlite";
import { insertExerciseToWorkout } from "../../db/queries/workout-exercises-queries";
import { insertSet } from "../../db/queries/set-queries";
import type { SetData } from "../../types/set";

let db: Database;
const userId = "userId1";

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

describe("insertSet", () => {
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
    expect(() =>
      insertSet(
        db,
        { reps: 5, weight: 10 },
        userId,
        "fakeWorkoutId",
        "fakeExerciseId"
      )
    ).toThrow("WORKOUT_EXERCISE_NOT_FOUND");
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
