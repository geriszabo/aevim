import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb, createTestUser } from "../../test/test-db";
import {
  deleteExerciseById,
  getAllExercises,
  getExerciseById,
  insertExercise,
  updateExerciseById,
} from "../../db/queries/exercise-queries";
import type { ExerciseData } from "../../db/schemas/exercise-schema";
import { insertWorkout } from "../../db/queries/workout-queries";
import { insertExerciseToWorkout } from "../../db/queries/workout-exercises-queries";

let db: Database;
let userId: string;
const exerciseData = {
  name: "Push Up",
  category: "Strength",
};

beforeEach(() => {
  db = createTestDb();
  userId = createTestUser(db);
});

afterEach(() => {
  db.close();
});

describe("insertExerciseToWorkout", () => {
  const workoutData = {
    date: "2025-08-03",
    name: "Morning Workout",
    notes: "Felt great!",
  };
  it("inserts exercise to workout", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const exercise = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    expect(exercise).toBeDefined();
    expect(exercise.exercise).toEqual({
      id: expect.any(String),
      name: "Push Up",
      category: "Strength",
      created_at: expect.any(String),
    });
  });

  it("inserts exercise with no category", async () => {
    const exerciseData = {
      name: "Push Up",
    };
    const workout = insertWorkout(db, workoutData, userId);
    const exercise = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    expect(exercise).toBeDefined();
    expect(exercise.exercise).toEqual({
      id: expect.any(String),
      name: "Push Up",
      category: null,
      created_at: expect.any(String),
    });
  });

  it("throws error when name is missing", () => {
    const exerciseData = {
      category: "Strength",
    } as ExerciseData;
    try {
      const workout = insertWorkout(db, workoutData, userId);
      insertExerciseToWorkout(db, exerciseData, userId, workout.id);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/NOT NULL constraint failed/);
      }
    }
  });
});

describe("insertExercise", () => {
  it("inserts exercise with category", () => {
    const exercise = insertExercise(db, exerciseData, userId);
    expect(exercise).toBeDefined();
    expect(exercise).toEqual({
      id: expect.any(String),
      name: "Push Up",
      category: "Strength",
      created_at: expect.any(String),
    });
  });

  it("inserts exercise with no category", () => {
    const exerciseData = {
      name: "Squat",
    };

    const exercise = insertExercise(db, exerciseData, userId);
    expect(exercise).toBeDefined();
    expect(exercise).toEqual({
      id: expect.any(String),
      name: "Squat",
      category: null,
      created_at: expect.any(String),
    });
  });

  it("throws error when name is missing", () => {
    const exerciseData = {
      category: "Strength",
    } as any;
    expect(() => insertExercise(db, exerciseData, userId)).toThrow(
      /NOT NULL constraint failed/
    );
  });
});

describe("getExerciseById", () => {
  it("returns exercise by id", () => {
    const exercise = insertExercise(db, exerciseData, userId);
    const foundExercise = getExerciseById(db, exercise.id, userId);
    expect(foundExercise).toEqual({
      id: exercise.id,
      name: "Push Up",
      category: "Strength",
      created_at: expect.any(String),
    });
  });

  it("returns null if exercise not found", () => {
    const foundExercise = getExerciseById(db, "non-existing-id", userId);
    expect(foundExercise).toBeNull();
  });
});

describe("deleteExerciseById", () => {
  const workoutData = {
    date: "2025-08-03",
    name: "Morning Workout",
    notes: "Felt great!",
  };
  it("deletes exercise by id", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const foundExercise = getExerciseById(db, exercise.id, userId);
    expect(foundExercise).toEqual({
      id: exercise.id,
      name: "Push Up",
      category: "Strength",
      created_at: expect.any(String),
    });
    deleteExerciseById(db, exercise.id, userId);
    const deletedExercise = getExerciseById(db, exercise.id, userId);
    expect(deletedExercise).toBeNull();
  });

  it("returns null if exercise is not found", async () => {
    const foundExercise = getExerciseById(db, "non-existing-id", userId);
    expect(foundExercise).toBeNull();
  });
});

describe("getAllExercises", () => {
  it("returns all exercises for user", () => {
    const count = 3;
    for (let i = 0; i < count; i++) {
      insertExercise(
        db,
        { ...exerciseData, name: `Exercise ${i + 1}` },
        userId
      );
    }
    const exercises = getAllExercises(db, userId);

    expect(exercises).toHaveLength(count);
    exercises!.forEach((exercise, index) => {
      expect(exercise).toEqual({
        id: expect.any(String),
        name: `Exercise ${index + 1}`,
        category: "Strength",
        created_at: expect.any(String),
      });
    });
  });

  it("returns empty array if user has no exercises", () => {
    const exercises = getAllExercises(db, userId);
    expect(exercises).toEqual([]);
  });
});

describe("updateExerciseById", () => {
  const workoutData = {
    date: "2025-08-03",
    name: "Morning Workout",
    notes: "Felt great!",
  };

  it("updates an exercise", async () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );
    const updatedExercise = updateExerciseById(db, exercise.id, userId, {
      name: "updated name",
      category: "updated category",
    });
    expect(updatedExercise).toEqual({
      id: exercise.id,
      name: "updated name",
      category: "updated category",
      created_at: expect.any(String),
    });
  });

  it("throws error exercise does not exist", () => {
    try {
      updateExerciseById(db, "non-existent-id", userId, {
        name: "new name",
      });
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/EXERCISE_NOT_FOUND/);
      }
    }
  });

  it("returns null if exercise belongs to another user", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      { name: "Test" },
      userId,
      workout.id
    );
    const otherUserId = "other-user";
    try {
      updateExerciseById(db, exercise.id, otherUserId, {
        name: "new name",
      });
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/EXERCISE_NOT_FOUND/);
      }
    }
  });

  it("updates only the name if only name is provided", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      { name: "name", category: "category" },
      userId,
      workout.id
    );
    const updatedName = updateExerciseById(db, exercise.id, userId, {
      name: "updated name",
    });
    expect(updatedName).toEqual({
      id: exercise.id,
      name: "updated name",
      category: "category",
      created_at: expect.any(String),
    });

    const updatedCategory = updateExerciseById(db, exercise.id, userId, {
      category: "updated category",
    });
    expect(updatedCategory).toEqual({
      id: exercise.id,
      name: "updated name",
      category: "updated category",
      created_at: expect.any(String),
    });
  });

  it("does not update if no fields are provided", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      { name: "name", category: "category" },
      userId,
      workout.id
    );
    try {
      updateExerciseById(db, exercise.id, userId, {
        category: null as any,
        name: null as any,
      });
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/NOT NULL constraint failed/);
      }
    }
  });
});
