import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../../test/test-db";
import { insertWorkout } from "../../db/queries/workout-queries";
import { insertExerciseToWorkout } from "../../db/queries/exercise-queries";
import { getWorkoutExercisesByWorkoutId } from "../../db/queries/workout-exercises-queries";

let db: Database;

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
    console.log(exercisesArray);
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
