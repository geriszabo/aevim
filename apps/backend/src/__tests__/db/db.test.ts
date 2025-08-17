import { describe, beforeEach, afterEach, expect, it } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb, createTestUser } from "../../test/test-db";
import {
  deleteWorkoutById,
  insertWorkout,
} from "../../db/queries/workout-queries";
import { deleteExerciseById } from "../../db/queries/exercise-queries";
import { insertExerciseToWorkout } from "../../db/queries/workout-exercises-queries";
import { insertSet } from "../../db/queries/set-queries";
import {
  createCompleteWorkout,
  getDataCounts,
  getOrphanedData,
} from "../../test/test-db-helpers";

let db: Database;
let userId: string;
const secondUserId = "otherUserId"
const secondUsername = "testuser70"

beforeEach(() => {
  db = createTestDb();
  userId = createTestUser(db);
});

afterEach(() => {
  db.close();
});

describe("Cascade Deletion Tests", () => {
  describe("Workout Deletion Cascade", () => {
    it("should delete workout and all related data without orphans", () => {
      // Create complete workout with exercise and sets
      const { workout } = createCompleteWorkout(db, userId);

      // Verify data was created
      const beforeCounts = getDataCounts(db, userId);
      expect(beforeCounts).toEqual({
        workouts: 1,
        exercises: 1,
        workoutExercises: 1,
        sets: 1,
      });

      // Check no orphans before deletion
      const beforeOrphans = getOrphanedData(db);
      expect(beforeOrphans.hasOrphans).toBe(false);

      // Delete the workout
      const deletedWorkout = deleteWorkoutById(db, workout.id, userId);
      expect(deletedWorkout).not.toBeNull();

      // Verify all data is gone
      const afterCounts = getDataCounts(db, userId);
      expect(afterCounts).toEqual({
        workouts: 0,
        exercises: 0,
        workoutExercises: 0,
        sets: 0,
      });

      // Verify no orphaned data exists
      const afterOrphans = getOrphanedData(db);
      expect(afterOrphans).toEqual({
        orphanedExercises: 0,
        orphanedWorkoutExercises: 0,
        orphanedSets: 0,
        hasOrphans: false,
      });
    });

    it("should delete workout with multiple exercises and sets", () => {
      const workoutData = {
        date: "2023-10-01",
        name: "Multi Exercise Workout",
        notes: "Test workout",
      };

      const workout = insertWorkout(db, workoutData, userId);

      // Create multiple exercises
      const exercises = [];
      for (let i = 0; i < 3; i++) {
        const { exercise } = insertExerciseToWorkout(
          db,
          { name: `Exercise ${i + 1}`, category: "Test" },
          userId,
          workout.id
        );
        exercises.push(exercise);

        // Add multiple sets per exercise
        for (let j = 0; j < 2; j++) {
          insertSet(
            db,
            { reps: 10 + j, metric_value: 100 + j * 10 },
            userId,
            workout.id,
            exercise.id
          );
        }
      }

      // Verify data was created (1 workout, 3 exercises, 3 workout_exercises, 6 sets)
      const beforeCounts = getDataCounts(db, userId);
      expect(beforeCounts).toEqual({
        workouts: 1,
        exercises: 3,
        workoutExercises: 3,
        sets: 6,
      });

      // Delete the workout
      deleteWorkoutById(db, workout.id, userId);

      // Verify all data is gone
      const afterCounts = getDataCounts(db, userId);
      expect(afterCounts).toEqual({
        workouts: 0,
        exercises: 0,
        workoutExercises: 0,
        sets: 0,
      });

      // Verify no orphans
      const orphans = getOrphanedData(db);
      expect(orphans.hasOrphans).toBe(false);
    });

    it("should not delete workout that doesn't belong to user", () => {
      const { workout } = createCompleteWorkout(db, userId);
      const otherUserId = createTestUser(db, secondUserId, secondUsername);

      // Try to delete with wrong user
      try {
        const result = deleteWorkoutById(db, workout.id, otherUserId);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toMatch(/WORKOUT_NOT_FOUND/);
        }
      }

      // Verify data still exists
      const counts = getDataCounts(db, userId);
      expect(counts.workouts).toBe(1);
      expect(counts.exercises).toBe(1);
    });
  });

  describe("Exercise Deletion Cascade", () => {
    it("should delete exercise and all related data without orphans", () => {
      const { exercise } = createCompleteWorkout(db, userId);

      // Verify data was created
      const beforeCounts = getDataCounts(db, userId);
      expect(beforeCounts).toEqual({
        workouts: 1,
        exercises: 1,
        workoutExercises: 1,
        sets: 1,
      });

      // Delete the exercise
      const deletedExercise = deleteExerciseById(db, exercise.id, userId);
      expect(deletedExercise).not.toBeNull();

      // Verify exercise and related data is gone, but workout remains
      const afterCounts = getDataCounts(db, userId);
      expect(afterCounts).toEqual({
        workouts: 1,
        exercises: 0,
        workoutExercises: 0,
        sets: 0,
      });

      // Verify no orphaned data exists
      const orphans = getOrphanedData(db);
      expect(orphans.hasOrphans).toBe(false);
    });

    it("should delete exercise with multiple sets", () => {
      const workoutData = {
        date: "2023-10-01",
        name: "Test Workout",
        notes: "Test workout",
      };

      const workout = insertWorkout(db, workoutData, userId);
      const { exercise } = insertExerciseToWorkout(
        db,
        { name: "Test Exercise", category: "Test" },
        userId,
        workout.id
      );

      // Add multiple sets
      for (let i = 0; i < 5; i++) {
        insertSet(
          db,
          { reps: 10 + i, metric_value: 100 + i * 10 },
          userId,
          workout.id,
          exercise.id
        );
      }

      // Verify data was created
      const beforeCounts = getDataCounts(db, userId);
      expect(beforeCounts.sets).toBe(5);

      // Delete the exercise
      deleteExerciseById(db, exercise.id, userId);

      // Verify all sets are deleted
      const afterCounts = getDataCounts(db, userId);
      expect(afterCounts).toEqual({
        workouts: 1,
        exercises: 0,
        workoutExercises: 0,
        sets: 0,
      });

      // Verify no orphans
      const orphans = getOrphanedData(db);
      expect(orphans.hasOrphans).toBe(false);
    });

    it("does not delete exercise that doesn't belong to user", () => {
      const { exercise } = createCompleteWorkout(db, userId);
      const otherUserId = createTestUser(db, secondUserId, secondUsername);

      try {
        deleteExerciseById(db, exercise.id, otherUserId);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toMatch(/EXERCISE_NOT_FOUND/);
        }
      }
      const counts = getDataCounts(db, userId);
      expect(counts.exercises).toBe(1);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle deletion of workout with multiple exercises correctly", () => {
      // Create two workouts
      const workout1 = insertWorkout(
        db,
        { date: "2023-10-01", name: "Workout 1", notes: "Test" },
        userId
      );
      const workout2 = insertWorkout(
        db,
        { date: "2023-10-02", name: "Workout 2", notes: "Test" },
        userId
      );

      // Create separate exercises for each
      const { exercise: ex1 } = insertExerciseToWorkout(
        db,
        { name: "Exercise 1", category: "Test" },
        userId,
        workout1.id
      );
      const { exercise: ex2 } = insertExerciseToWorkout(
        db,
        { name: "Exercise 2", category: "Test" },
        userId,
        workout2.id
      );

      // Add sets to both
      insertSet(db, { reps: 10, metric_value: 69 }, userId, workout1.id, ex1.id);
      insertSet(db, { reps: 10, metric_value: 69 }, userId, workout2.id, ex2.id);

      // Verify initial state
      const beforeCounts = getDataCounts(db, userId);
      expect(beforeCounts).toEqual({
        workouts: 2,
        exercises: 2,
        workoutExercises: 2,
        sets: 2,
      });

      // Delete first workout
      deleteWorkoutById(db, workout1.id, userId);

      // Verify only first workout's data is deleted
      const afterCounts = getDataCounts(db, userId);
      expect(afterCounts).toEqual({
        workouts: 1,
        exercises: 1,
        workoutExercises: 1,
        sets: 1,
      });

      // Verify no orphans (except maybe Bruce Wayne🦇)
      const orphans = getOrphanedData(db);
      expect(orphans.hasOrphans).toBe(false);
    });
  });
});
