import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../../test/test-db";
import { insertWorkout } from "../../db/queries/workout-queries";
import {
  deleteExerciseFromWorkout,
  getWorkoutExercisesByWorkoutId,
  insertExerciseToWorkout,
} from "../../db/queries/workout-exercises-queries";
import { insertExercise } from "../../db/queries/exercise-queries";

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

describe("getWorkoutExercisesByWorkoutId", () => {
  const userId = "szabogeri69";
  const workoutData = {
    name: "Test Workout",
    date: "2023-10-01",
    notes: "This is a test workout",
  };

  const exercises = [
    { name: "Push Up", category: "Strength" },
    { name: "Squat", category: "Strength" },
    { name: "Running", category: "Cardio" },
  ];
  it("returns workout exercises for a given workout id", () => {
    const workout = insertWorkout(db, workoutData, userId);
    exercises.forEach((exercise) => {
      insertExerciseToWorkout(db, exercise, userId, workout.id);
    });
    const exercisesArray = getWorkoutExercisesByWorkoutId(db, workout.id);
    expect(exercisesArray).toBeArray();
    expect(exercisesArray).toHaveLength(exercises.length);
    exercisesArray.forEach((exercise, index) => {
      expect(exercise).toEqual({
        id: expect.any(String),
        name: exercises[index]!.name,
        order_index: index + 1,
        category: exercises[index]!.category,
        created_at: expect.any(String),
      });
    });
  });
});

describe("deleteExerciseFromWorkout", () => {
  const workoutData = {
    date: "2025.08.03",
    name: "Morning Workout",
    notes: "Felt great!",
  };

  it("deletes exercise from workout successfully", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise, workoutExercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );

    const deleted = deleteExerciseFromWorkout(
      db,
      workout.id,
      exercise.id,
      userId
    );

    expect(deleted).toBeDefined();
    expect(deleted).toEqual({
      id: workoutExercise.id,
      workout_id: workout.id,
      exercise_id: exercise.id,
    });
  });

  it("returns null if exercise not found in workout", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const exercise = insertExercise(db, exerciseData, userId);

    const deleted = deleteExerciseFromWorkout(
      db,
      workout.id,
      exercise.id,
      userId
    );

    expect(deleted).toBeNull();
  });

  it("returns null if workout does not exist", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );

    const deleted = deleteExerciseFromWorkout(
      db,
      "non-existent-workout",
      exercise.id,
      userId
    );

    expect(deleted).toBeNull();
  });

  it("returns null if exercise does not exist", () => {
    const workout = insertWorkout(db, workoutData, userId);

    const deleted = deleteExerciseFromWorkout(
      db,
      workout.id,
      "non-existent-exercise",
      userId
    );

    expect(deleted).toBeNull();
  });

  it("returns null if user does not own the workout", () => {
    const workout = insertWorkout(db, workoutData, userId);
    const { exercise } = insertExerciseToWorkout(
      db,
      exerciseData,
      userId,
      workout.id
    );

    const deleted = deleteExerciseFromWorkout(
      db,
      workout.id,
      exercise.id,
      "different-user-id"
    );

    expect(deleted).toBeNull();
  });
});
