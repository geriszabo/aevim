import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../../test/test-db";

import type { WorkoutData } from "../../types/workout";
import {
  deleteWorkoutById,
  getWorkoutById,
  getWorkoutExercisesByWorkoutId,
  getWorkoutsByUserId,
  insertWorkout,
  updateWorkoutById,
} from "../../db/queries/workout-queries";
import { insertExerciseToWorkout } from "../../db/queries/workout-exercises-queries";

let db: Database;
const userId = "userId1";

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

const workoutData: WorkoutData = {
  date: "now",
  name: "gym session",
  notes: "just a couple of notes",
};

describe("insertWorkout", () => {
  it("inserts a workout", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    expect(workout).toEqual({
      id: expect.any(String),
      name: workoutData.name,
      notes: workoutData.notes,
      date: workoutData.date,
      created_at: expect.any(String),
    });
  });

  it("throws error if date or name are missing", async () => {
    const workoutData = {
      date: undefined,
      name: undefined,
    } as unknown as WorkoutData;
    try {
      insertWorkout(db, workoutData, userId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/NOT NULL constraint failed/);
      }
    }
  });
});

describe("getWorkoutsByUserId", () => {
  it("returns users workouts", async () => {
    const count = 3;
    for (let i = 0; i < count; i++) {
      insertWorkout(db, workoutData, userId);
    }
    const workouts = getWorkoutsByUserId(db, userId);
    const expectedWorkout = {
      id: expect.any(String),
      name: "gym session",
      created_at: expect.any(String),
      date: "now",
      notes: "just a couple of notes",
    };

    expect(workouts).toHaveLength(count);
    workouts.forEach((workout) => {
      expect(workout).toMatchObject(expectedWorkout);
    });
  });

  it("returns [] if user does not have any logged workouts", async () => {
    const workouts = getWorkoutsByUserId(db, userId);
    expect(workouts).toEqual([]);
  });

  it("does not return workouts belonging to other users", async () => {
    insertWorkout(db, workoutData, userId);
    insertWorkout(db, workoutData, userId);
    insertWorkout(db, workoutData, "differentUser");
    const workouts = getWorkoutsByUserId(db, userId);
    const differentUserWorkouts = workouts.filter(
      (workout) => workout.user_id === "differentUser"
    );
    expect(workouts).toHaveLength(2);
    expect(differentUserWorkouts).toHaveLength(0);
    expect(differentUserWorkouts).toEqual([]);
  });
});

describe("getWorkoutById", () => {
  it("returns workout with given id", async () => {
    insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    insertWorkout(
      db,
      { date: "tomorrow", name: "workout 2", notes: "note for workout 2" },
      userId
    );
    const workouts = getWorkoutsByUserId(db, userId);
    expect(workouts).toHaveLength(2);
    const firstWorkout = getWorkoutById(db, userId, workouts[1]?.id!);
    expect(firstWorkout).toBeDefined();

    expect(firstWorkout).toEqual({
      id: workouts[1]!.id,
      name: "workout 1",
      notes: "note for workout 1",
      date: "today",
      created_at: expect.any(String),
    });
  });

  it("returns null if workout id is invalid", async () => {
    const workout = getWorkoutById(db, userId, "invalidWorkoutId");
    expect(workout).toBeNull();
  });

  it("returns null if user id is invalid", async () => {
    const workoutId = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    ).id;
    const workout = getWorkoutById(db, "invalidUserId", workoutId);
    expect(workout).toBeNull();
  });
});

describe("updateWorkoutById", () => {
  const updatesArray = [
    { name: "updated name only" },
    { date: "updated date only" },
    { notes: "updated notes only" },
    { name: "new name", date: "new date" },
    { name: "new name", date: "new date", notes: "new notes too" },
  ];

  it("updates a workout with given data", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    const updatedFields = {
      date: "updated date",
      name: "updated workout name",
      notes: "updated note",
    };
    const updatedWorkout = updateWorkoutById(
      db,
      workout.id,
      userId,
      updatedFields
    );
    expect(updatedWorkout).toEqual({
      ...updatedFields,
      created_at: expect.any(String),
      id: expect.any(String),
    });
  });

  it("updates only the data that is to be updated", async () => {
    updatesArray.forEach((update) => {
      const workout = insertWorkout(
        db,
        { date: "today", name: "workout 1", notes: "note for workout 1" },
        userId
      );
      const updatedWorkout = updateWorkoutById(db, workout.id, userId, update);
      expect(updatedWorkout).toEqual({
        ...workout,
        ...update,
      });
    });
  });

  it("throws error if there is no data to update", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    try {
      const updatedWorkout = updateWorkoutById(db, workout.id, userId, {});
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/near \"WHERE\": syntax error/);
      }
    }
  });

  it("throws error if update data is undefined or null", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    try {
      updateWorkoutById(db, workout.id, userId, {
        date: null as unknown as undefined,
        name: null as unknown as undefined,
      });
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/NOT NULL constraint failed/);
      }
    }
  });

  it("returns null when trying to update another user's workout", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      "user1"
    );

    const result = updateWorkoutById(db, workout.id, "user2", {
      name: "hacked",
    });
    expect(result).toBeNull();
  });

  describe("deleteWorkoutById", () => {
    it("deletes a workout by id and userId", async () => {
      const workout = insertWorkout(
        db,
        { date: "2024-06-01", name: "delete me", notes: "to be deleted" },
        userId
      );
      const deleted = deleteWorkoutById(db, workout.id, userId);
      expect(deleted).toEqual({
        id: workout.id,
        name: "delete me",
      });

      const retryFindingWorkout = getWorkoutById(db, userId, workout.id);
      expect(retryFindingWorkout).toBeNull();
    });

    it("returns null if workout does not exist", async () => {
      const deleted = deleteWorkoutById(db, "nonexistent-id", userId);
      expect(deleted).toBeNull();
    });

    it("returns null if workout exists but belongs to another user", async () => {
      const workout = insertWorkout(
        db,
        { date: "2024-06-01", name: "not your workout", notes: "nope" },
        "otherUser"
      );
      const deleted = deleteWorkoutById(db, workout.id, userId);
      expect(deleted).toBeNull();
      const retryFindingWorkout = getWorkoutById(db, "otherUser", workout.id);
      expect(retryFindingWorkout).not.toBeNull();
    });
  });
});

describe("getWorkoutExercisesByWorkoutId", () => {
  it("returns all exercises for a given workout", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const exercises = [
      { name: "Push Up", category: "Strength" },
      { name: "Squat", category: "Strength" },
      { name: "Running", category: "Cardio" },
    ];
    exercises.forEach((exercise) => {
      insertExerciseToWorkout(db, exercise, userId, workout.id);
    });
    const allExercises = getWorkoutExercisesByWorkoutId(db, workout.id, userId);
    expect(allExercises.length).toBe(3);
    allExercises.forEach((exercise, index) => {
      expect(exercise).toEqual({
        id: expect.any(String),
        workout_id: workout.id,
        exercise_id: expect.any(String),
        order_index: index + 1,
        notes: null,
        created_at: expect.any(String),
        name: expect.any(String),
        category: expect.any(String),
      });
    });
  });

  it("returns an empty array if no exercises are attached", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const exercises = getWorkoutExercisesByWorkoutId(db, workout.id, userId);
    expect(exercises).toEqual([]);
  });

  it("returns an empty array if workout does not exist", () => {
    const exercises = getWorkoutExercisesByWorkoutId(
      db,
      "non-existent-id",
      userId
    );
    expect(exercises).toEqual([]);
  });

  it("orders exercises by order_index", () => {
    const workout = insertWorkout(db, workoutData, userId);
    insertExerciseToWorkout(
      db,
      { name: "First", category: "first category" },
      userId,
      workout.id
    );
    insertExerciseToWorkout(db, { name: "Second" }, userId, workout.id);

    const exercises = getWorkoutExercisesByWorkoutId(db, workout.id, userId);

    expect(exercises[0]!.order_index).toBeLessThan(exercises[1]!.order_index);
  });
});
