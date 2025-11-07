import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb, createTestUser } from "../../test/test-db";

import {
  deleteWorkoutById,
  getWorkoutById,
  getExercisesByWorkoutId,
  getCompleteWorkoutByWorkoutId,
  getWorkoutsByUserId,
  insertWorkout,
  updateWorkoutById,
} from "../../db/queries/workout-queries";
import { insertExerciseToWorkout } from "../../db/queries/workout-exercises-queries";
import type { SetData } from "../../types/set";
import { insertSet } from "../../db/queries/set-queries";
import type { WorkoutData } from "@aevim/shared-types";

let db: Database;
let userId: string;

beforeEach(() => {
  db = createTestDb();
  userId = createTestUser(db);
});

afterEach(() => {
  db.close();
});

const workoutData: WorkoutData = {
  date: "2025-01-15",
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
      date: "2025-01-15",
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

    const differentUserId = createTestUser(db);
    insertWorkout(db, workoutData, differentUserId);

    const workouts = getWorkoutsByUserId(db, userId);
    expect(workouts).toHaveLength(2);
  });

  describe("query parameters", () => {
    it("limits the number of workouts returned", async () => {
      const count = 5;
      for (let i = 0; i < count; i++) {
        insertWorkout(db, workoutData, userId);
      }
      const limit = 3;
      const workouts = getWorkoutsByUserId(db, userId, { limit });
      expect(workouts).toHaveLength(limit);
    });

    it("returns all workouts when limit is greater than total", async () => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        insertWorkout(db, workoutData, userId);
      }
      const limit = 10;
      const workouts = getWorkoutsByUserId(db, userId, { limit });
      expect(workouts).toHaveLength(count);
    });

    it("applies offset to skip workouts", async () => {
      const count = 5;
      const workouts = [];
      for (let i = 0; i < count; i++) {
        const workout = insertWorkout(db, workoutData, userId);
        workouts.push(workout);
      }
      const offset = 2;
      const limit = 2;
      const result = getWorkoutsByUserId(db, userId, { limit, offset });
      expect(result).toHaveLength(limit);
      // Results should be ordered by date DESC, so offset 2 should skip first 2
      expect(result[0]?.id).toBe(workouts[2]?.id);
      expect(result[1]?.id).toBe(workouts[3]?.id);
    });

    it("returns empty array when offset exceeds total workouts", async () => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        insertWorkout(db, workoutData, userId);
      }
      const offset = 10;
      const limit = 5;
      const workouts = getWorkoutsByUserId(db, userId, { limit, offset });
      expect(workouts).toEqual([]);
    });

    it("filters workouts by startDate", async () => {
      const testData = [
        { date: "2025-01-10", name: "Early workout" },
        { date: "2025-01-15", name: "Middle workout" },
        { date: "2025-01-20", name: "Late workout" },
      ];

      for (const data of testData) {
        insertWorkout(db, data, userId);
      }

      const startDate = "2025-01-15";
      const workouts = getWorkoutsByUserId(db, userId, { startDate });
      expect(workouts).toHaveLength(2);
      workouts.forEach((workout) => {
        expect(workout.date >= startDate).toBe(true);
      });
    });

    it("filters workouts by endDate", async () => {
      const testData = [
        { date: "2025-01-10", name: "Early workout" },
        { date: "2025-01-15", name: "Middle workout" },
        { date: "2025-01-20", name: "Late workout" },
      ];

      for (const data of testData) {
        insertWorkout(db, data, userId);
      }

      const endDate = "2025-01-15";
      const workouts = getWorkoutsByUserId(db, userId, { endDate });
      expect(workouts).toHaveLength(2);
      workouts.forEach((workout) => {
        expect(workout.date <= endDate).toBe(true);
      });
    });

    it("filters workouts by both startDate and endDate", async () => {
      const testData = [
        { date: "2025-01-10", name: "Early workout" },
        { date: "2025-01-15", name: "Middle workout" },
        { date: "2025-01-20", name: "Late workout" },
        { date: "2025-01-25", name: "Very late workout" },
      ];

      for (const data of testData) {
        insertWorkout(db, data, userId);
      }

      const startDate = "2025-01-12";
      const endDate = "2025-01-22";
      const workouts = getWorkoutsByUserId(db, userId, { startDate, endDate });
      expect(workouts).toHaveLength(2);
      workouts.forEach((workout) => {
        expect(workout.date >= startDate).toBe(true);
        expect(workout.date <= endDate).toBe(true);
      });
    });

    it("returns empty array when date range has no matches", async () => {
      const testData = [
        { date: "2025-01-10", name: "Early workout" },
        { date: "2025-01-20", name: "Late workout" },
      ];

      for (const data of testData) {
        insertWorkout(db, data, userId);
      }

      const startDate = "2025-02-01";
      const endDate = "2025-02-10";
      const workouts = getWorkoutsByUserId(db, userId, { startDate, endDate });
      expect(workouts).toEqual([]);
    });

    it("combines limit, offset, startDate, and endDate", async () => {
      const testData = [
        { date: "2025-01-10", name: "Workout 1" },
        { date: "2025-01-15", name: "Workout 2" },
        { date: "2025-01-20", name: "Workout 3" },
        { date: "2025-01-25", name: "Workout 4" },
        { date: "2025-02-01", name: "Workout 5" },
      ];

      for (const data of testData) {
        insertWorkout(db, data, userId);
      }

      const startDate = "2025-01-12";
      const endDate = "2025-01-30";
      const limit = 2;
      const offset = 1;
      const workouts = getWorkoutsByUserId(db, userId, {
        startDate,
        endDate,
        limit,
        offset,
      });

      expect(workouts).toHaveLength(limit);
      workouts.forEach((workout) => {
        expect(workout.date >= startDate).toBe(true);
        expect(workout.date <= endDate).toBe(true);
      });
    });

    it("handles startDate equal to endDate", async () => {
      const testData = [
        { date: "2025-01-15", name: "Exact date workout" },
        { date: "2025-01-20", name: "Other workout" },
      ];

      for (const data of testData) {
        insertWorkout(db, data, userId);
      }
      const startDate = "2025-01-15";
      const endDate = "2025-01-15";
      const workouts = getWorkoutsByUserId(db, userId, { startDate, endDate });
      expect(workouts).toHaveLength(1);
      expect(workouts[0]?.date).toBe("2025-01-15");
    });
  });
});

describe("getWorkoutById", () => {
  it("returns workout with given id", async () => {
    insertWorkout(
      db,
      { date: "2025-02-10", name: "workout 1", notes: "note for workout 1" },
      userId,
    );
    insertWorkout(
      db,
      { date: "2025-02-11", name: "workout 2", notes: "note for workout 2" },
      userId,
    );
    const workouts = getWorkoutsByUserId(db, userId);
    expect(workouts).toHaveLength(2);
    const firstWorkout = getWorkoutById(db, userId, workouts[1]!.id!);
    expect(firstWorkout).toBeDefined();

    expect(firstWorkout).toEqual({
      id: workouts[1]!.id,
      name: "workout 1",
      notes: "note for workout 1",
      date: "2025-02-10",
      created_at: expect.any(String),
    });
  });

  it("throws error if workout id is invalid", async () => {
    try {
      getWorkoutById(db, userId, "invalidWorkoutId");
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
      }
    }
  });

  it("throws error if user id is invalid", async () => {
    const workoutId = insertWorkout(
      db,
      { date: "2025-02-10", name: "workout 1", notes: "note for workout 1" },
      userId,
    ).id;
    try {
      getWorkoutById(db, "invalidUserId", workoutId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
      }
    }
  });
});

describe("updateWorkoutById", () => {
  const updatesArray = [
    { name: "updated name only" },
    { date: "2025-02-10" },
    { notes: "updated notes only" },
    { name: "new name", date: "2025-02-19" },
    { name: "new name", date: "2025-02-19", notes: "new notes too" },
  ];

  it("updates a workout with given data", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId,
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
      updatedFields,
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
        userId,
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
      userId,
    );
    try {
      updateWorkoutById(db, workout.id, userId, {});
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/near "WHERE": syntax error/);
      }
    }
  });

  it("throws error if update data is undefined or null", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId,
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
    const workout = insertWorkout(db, workoutData, userId);
    const differentUserId = createTestUser(db);
    try {
      updateWorkoutById(
        db,
        workout.id,
        differentUserId, // Try to update with different user
        { name: "new name" },
      );
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
      }
    }
  });

  describe("deleteWorkoutById", () => {
    it("deletes a workout by id and userId", async () => {
      const workout = insertWorkout(
        db,
        { date: "2024-06-01", name: "delete me", notes: "to be deleted" },
        userId,
      );
      const deleted = deleteWorkoutById(db, workout.id, userId);
      expect(deleted).toEqual({
        id: workout.id,
        name: "delete me",
      });
      try {
        getWorkoutById(db, userId, workout.id);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
        }
      }
    });

    it("returns null if workout does not exist", async () => {
      try {
        deleteWorkoutById(db, "nonexistent-id", userId);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
        }
      }
    });

    it("returns null if workout exists but belongs to another user", async () => {
      const workout = insertWorkout(db, workoutData, userId);
      const differentUserId = createTestUser(db);
      try {
        deleteWorkoutById(db, workout.id, differentUserId);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
        }
      }
    });
  });
});

describe("getWorkoutExercisesByWorkoutId", () => {
  it("returns all exercises for a given workout", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const exercises = [
      { code: "E69", name: "Push Up", category: "Strength" },
      { code: "E69", name: "Squat", category: "Strength" },
      { code: "E69", name: "Running", category: "Cardio" },
    ];
    exercises.forEach((exercise) => {
      insertExerciseToWorkout(db, exercise, userId, workout.id);
    });
    const allExercises = getExercisesByWorkoutId(db, workout.id, userId);
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
    const exercises = getExercisesByWorkoutId(db, workout.id, userId);
    expect(exercises).toEqual([]);
  });

  it("throws an error if workout does not exist", () => {
    try {
      getExercisesByWorkoutId(db, "non-existent-id", userId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
      }
    }
  });

  it("orders exercises by order_index", () => {
    const workout = insertWorkout(db, workoutData, userId);
    insertExerciseToWorkout(
      db,
      { name: "First", code: "E69", category: "first category" },
      userId,
      workout.id,
    );
    insertExerciseToWorkout(
      db,
      { name: "Second", code: "E69" },
      userId,
      workout.id,
    );

    const exercises = getExercisesByWorkoutId(db, workout.id, userId);

    expect(exercises[0]!.order_index).toBeLessThan(exercises[1]!.order_index);
  });
});

describe("getCompleteWorkoutByWorkoutId", () => {
  it("returns workout with exercises and sets", async () => {
    const setData: SetData = { reps: 10, metric_value: 50 };
    const workout = insertWorkout(db, workoutData, userId);

    const exercisesArray = [
      {
        name: "Exercise 1",
        category: "Category 1",
        metric: "weight",
        code: "E69",
      },
      {
        name: "Exercise 2",
        category: "Category 2",
        metric: "weight",
        code: "E69",
      },
      {
        name: "Exercise 3",
        category: "Category 3",
        metric: "weight",
        code: "E69",
      },
    ];

    exercisesArray.forEach((exercise) => {
      insertExerciseToWorkout(db, exercise, userId, workout.id);
    });

    const exercises = getExercisesByWorkoutId(db, workout.id, userId);

    exercises.forEach((exercise) => {
      insertSet(db, setData, userId, workout.id, exercise.exercise_id);
      insertSet(db, setData, userId, workout.id, exercise.exercise_id);
      insertSet(db, setData, userId, workout.id, exercise.exercise_id);
    });

    const overview = getCompleteWorkoutByWorkoutId(db, workout.id, userId);
    expect(overview).toBeDefined();
    expect(overview!.exercises).toHaveLength(3);

    overview!.exercises.forEach((exercise, exerciseIndex) => {
      expect(exercise).toEqual({
        id: expect.any(String),
        workout_id: expect.any(String),
        exercise_id: expect.any(String),
        order_index: exerciseIndex + 1,
        created_at: expect.any(String),
        name: `Exercise ${exerciseIndex + 1}`,
        category: `Category ${exerciseIndex + 1}`,
        metric: "weight",
        sets: expect.any(Array),
        code: "E69",
      });

      expect(exercise.sets).toHaveLength(3);
      exercise.sets.forEach((set, setIndex) => {
        expect(set).toEqual({
          id: expect.any(String),
          workout_exercise_id: expect.any(String),
          reps: 10,
          metric_value: 50,
          order_index: setIndex + 1,
          created_at: expect.any(String),
        });
      });
    });
    expect(overview!.workout).toEqual({
      id: expect.any(String),
      name: workoutData.name,
      notes: workoutData.notes,
      date: workoutData.date,
      created_at: expect.any(String),
    });
  });

  it("throws error when workout does not exist", async () => {
    try {
      getCompleteWorkoutByWorkoutId(db, "fakeWorkoutId", userId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
        expect(error).toBeInstanceOf(Error);
      }
    }
  });

  it("returns workout with exercises but no sets", async () => {
    const workout = insertWorkout(db, workoutData, userId);

    const exercisesArray = [
      { name: "Exercise 1", code: "E69", category: "Category 1" },
      { name: "Exercise 2", code: "E69", category: "Category 2" },
    ];
    exercisesArray.forEach((exercise) => {
      insertExerciseToWorkout(db, exercise, userId, workout.id);
    });
    const overview = getCompleteWorkoutByWorkoutId(db, workout.id, userId);
    expect(overview).toBeDefined();
    expect(overview!.exercises).toHaveLength(2);
    overview!.exercises.forEach((exercise) => {
      expect(exercise.sets).toHaveLength(0);
      expect(exercise.sets).toEqual([]);
    });
  });

  it("returns workout with no exercises", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const overview = getCompleteWorkoutByWorkoutId(db, workout.id, userId);

    expect(overview).toBeDefined();
    expect(overview!.workout).toEqual({
      id: workout.id,
      name: workoutData.name,
      notes: workoutData.notes,
      date: workoutData.date,
      created_at: expect.any(String),
    });
    expect(overview!.exercises).toHaveLength(0);
    expect(overview!.exercises).toEqual([]);
  });

  it("maintains correct exercise order", async () => {
    const setData: SetData = { reps: 8, metric_value: 40 };
    const workout = insertWorkout(db, workoutData, userId);

    const exercisesArray = [
      { name: "First Exercise", code: "E69", category: "Category 1" },
      { name: "Second Exercise", code: "E69", category: "Category 2" },
      { name: "Third Exercise", code: "E69", category: "Category 3" },
      { name: "Fourth Exercise", code: "E69", category: "Category 4" },
    ];

    exercisesArray.forEach((exercise) => {
      insertExerciseToWorkout(db, exercise, userId, workout.id);
    });
    const exercises = getExercisesByWorkoutId(db, workout.id, userId);
    exercises.forEach((exercise) => {
      insertSet(db, setData, userId, workout.id, exercise.exercise_id);
    });
  });
});
