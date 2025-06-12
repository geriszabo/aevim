import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../../test/test-db";
import {
  getAllExercises,
  getExerciseById,
  insertExercise,
  insertExerciseToWorkout,
} from "../../db/queries/exercise-queries";
import type { ExerciseData } from "../../db/schemas/exercise-schema";
import { insertWorkout } from "../../db/queries/workout-queries";

let db: Database;
const userId = "szabogeri69";
const exerciseData = {
  name: "Push Up",
  category: "Strength",
};

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

describe("insertExerciseToWorkout", () => {
  const workoutData = {
    date: "2025.08.03",
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
    date: "2025.08.03",
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
