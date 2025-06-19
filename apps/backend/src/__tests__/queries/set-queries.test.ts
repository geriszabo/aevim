import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { insertWorkout } from "../../db/queries/workout-queries";
import { createTestDb } from "../../test/test-db";
import { Database } from "bun:sqlite";
import { insertExerciseToWorkout } from "../../db/queries/workout-exercises-queries";
import {
  deleteSetBySetId,
  getAllSetsByExerciseId,
  insertSet,
  updateSetById,
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

describe("deleteSetBySetId", () => {
  it("successfully deletes a set", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const set = insertSet(db, setData, userId, workout.id, exercise.id);
    const setsBefore = getAllSetsByExerciseId(
      db,
      userId,
      workout.id,
      exercise.id
    );
    expect(setsBefore).toHaveLength(1);
    expect(setsBefore[0]?.id).toBe(set.id);
    const deletedSet = deleteSetBySetId(db, set.id, userId);
    const setsAfter = getAllSetsByExerciseId(
      db,
      userId,
      workout.id,
      exercise.id
    );
    expect(deletedSet).toEqual({
      id: expect.any(String),
    });
    expect(setsAfter).toEqual([]);
  });

  it("deletes only the specified set when multiple sets exist", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );

    const set1 = insertSet(
      db,
      { reps: 10, weight: 100 },
      userId,
      workout.id,
      exercise.id
    );
    const set2 = insertSet(
      db,
      { reps: 8, weight: 110 },
      userId,
      workout.id,
      exercise.id
    );
    const set3 = insertSet(
      db,
      { reps: 6, weight: 120 },
      userId,
      workout.id,
      exercise.id
    );
    const setsBefore = getAllSetsByExerciseId(
      db,
      userId,
      workout.id,
      exercise.id
    );
    expect(setsBefore).toHaveLength(3);
    const deletedSet = deleteSetBySetId(db, set2.id, userId);
    expect(deletedSet).toEqual({
      id: set2.id,
    });
    const setsAfter = getAllSetsByExerciseId(
      db,
      userId,
      workout.id,
      exercise.id
    );
    expect(setsAfter).toHaveLength(2);

    const remainingSetIds = setsAfter.map((set) => set.id);
    expect(remainingSetIds).toContain(set1.id);
    expect(remainingSetIds).toContain(set3.id);
    expect(remainingSetIds).not.toContain(set2.id);
  });

  it("handles deletion from different exercises correctly", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise: exercise1 } = insertExerciseToWorkout(
      db,
      { name: "Exercise 1", category: "test" },
      userId,
      workout.id
    );
    const { exercise: exercise2 } = insertExerciseToWorkout(
      db,
      { name: "Exercise 2", category: "test" },
      userId,
      workout.id
    );
    const set1Ex1 = insertSet(db, setData, userId, workout.id, exercise1.id);
    const set2Ex1 = insertSet(db, setData, userId, workout.id, exercise1.id);
    const set1Ex2 = insertSet(db, setData, userId, workout.id, exercise2.id);
    const deletedSet = deleteSetBySetId(db, set1Ex1.id, userId);
    expect(deletedSet).toEqual({ id: set1Ex1.id });
    const setsEx1 = getAllSetsByExerciseId(
      db,
      userId,
      workout.id,
      exercise1.id
    );
    const setsEx2 = getAllSetsByExerciseId(
      db,
      userId,
      workout.id,
      exercise2.id
    );
    expect(setsEx1).toHaveLength(1);
    expect(setsEx1[0]!.id).toBe(set2Ex1.id);
    expect(setsEx2).toHaveLength(1);
    expect(setsEx2[0]!.id).toBe(set1Ex2.id);
  });
});

describe("updateSetById", () => {
  it("successfully updates all set fields", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const set = insertSet(db, setData, userId, workout.id, exercise.id);
    const updates = {
      reps: 6,
      weight: 25,
      duration: 120,
    };

    const updatedSet = updateSetById(db, set.id, updates, userId);
    expect(updatedSet).toEqual({
      id: set.id,
      workout_exercise_id: expect.any(String),
      reps: 6,
      weight: 25,
      duration: 120,
      order_index: 1,
      created_at: expect.any(String),
      distance: null,
      notes: "felt pretty good",
    });

    const sets = getAllSetsByExerciseId(db, userId, workout.id, exercise.id);
    expect(sets).toHaveLength(1);
    expect(sets[0]?.reps).toBe(6);
    expect(sets[0]?.weight).toBe(25);
    expect(sets[0]?.duration).toBe(120);
  });

  it("successfully updates only 1 field", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const set = insertSet(db, setData, userId, workout.id, exercise.id);
    // Update only weight
    const updates = { weight: 30 };
    const updatedSet = updateSetById(db, set.id, updates, userId);
    expect(updatedSet).toEqual({
      id: set.id,
      workout_exercise_id: expect.any(String),
      reps: 4,
      weight: 30,
      duration: null,
      order_index: 1,
      created_at: expect.any(String),
      distance: null,
      notes: "felt pretty good",
    });
  });

  it("throws error when set does not exist", async () => {
    const fakeSetId = "non-existent-set-id";
    const updates = { reps: 20 };
    try {
      updateSetById(db, fakeSetId, updates, userId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/SET_NOT_FOUND/);
      }
    }
  });
  it("returns null when no updates are provided", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const set = insertSet(db, setData, userId, workout.id, exercise.id);
    try {
      updateSetById(db, set.id, {}, userId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/near \"WHERE\": syntax error/);
      }
    }
  });
  it("updates only the specified set when multiple sets exist", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );

    insertSet(db, { reps: 10, weight: 100 }, userId, workout.id, exercise.id);
    const set2 = insertSet(
      db,
      { reps: 8, weight: 110 },
      userId,
      workout.id,
      exercise.id
    );
    insertSet(db, { reps: 6, weight: 120 }, userId, workout.id, exercise.id);

    const updates = { reps: 12, weight: 130 };
    const updatedSet = updateSetById(db, set2.id, updates, userId);

    expect(updatedSet).toEqual({
      id: set2.id,
      workout_exercise_id: expect.any(String),
      reps: 12,
      weight: 130,
      duration: null,
      order_index: 2,
      created_at: expect.any(String),
      distance: null,
      notes: null,
    });

    const allSets = getAllSetsByExerciseId(db, userId, workout.id, exercise.id);
    expect(allSets).toHaveLength(3);
    expect(allSets[0]?.reps).toBe(10);
    expect(allSets[0]?.weight).toBe(100);
    expect(allSets[1]?.reps).toBe(12);
    expect(allSets[1]?.weight).toBe(130);
    expect(allSets[2]?.reps).toBe(6);
    expect(allSets[2]?.weight).toBe(120);
  });
  it("handles null values correctly", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const set = insertSet(
      db,
      { reps: 10, weight: 100 },
      userId,
      workout.id,
      exercise.id
    );
    const updates = { weight: null } as any;
    const updatedSet = updateSetById(db, set.id, updates, userId);

    expect(updatedSet).toEqual({
      id: set.id,
      workout_exercise_id: expect.any(String),
      reps: 10,
      weight: null,
      duration: null,
      order_index: 1,
      created_at: expect.any(String),
      notes: null,
      distance: null,
    });
  });
});
