import { Database } from "bun:sqlite";
import { insertWorkout } from "../db/queries/workout-queries";
import { insertExerciseToWorkout } from "../db/queries/workout-exercises-queries";
import { insertSet } from "../db/queries/set-queries";
import { createUserBiometrics } from "../db/queries/user-queries";
import type { UserBiometrics } from "@aevim/shared-types";


export const getDataCounts = (db: Database, userId: string) => {
  const workouts = db.query(`
    SELECT COUNT(*) as count FROM workouts WHERE user_id = ?
  `).get(userId) as { count: number };

  const exercises = db.query(`
    SELECT COUNT(*) as count FROM exercises WHERE user_id = ?
  `).get(userId) as { count: number };

  const workoutExercises = db.query(`
    SELECT COUNT(*) as count FROM workout_exercises 
    WHERE workout_id IN (SELECT id FROM workouts WHERE user_id = ?)
  `).get(userId) as { count: number };

  const sets = db.query(`
    SELECT COUNT(*) as count FROM sets 
    WHERE workout_exercise_id IN (
      SELECT we.id FROM workout_exercises we
      JOIN workouts w ON we.workout_id = w.id
      WHERE w.user_id = ?
    )
  `).get(userId) as { count: number };

  return {
    workouts: workouts.count,
    exercises: exercises.count,
    workoutExercises: workoutExercises.count,
    sets: sets.count,
  };
};

export const getOrphanedData = (db: Database) => {
  // Orphaned exercises (user_id doesn't exist)
  const orphanedExercises = db.query(`
    SELECT COUNT(*) as count FROM exercises 
    WHERE user_id NOT IN (SELECT id FROM users)
  `).get() as { count: number };

  // Orphaned workout_exercises (workout_id or exercise_id doesn't exist)
  const orphanedWorkoutExercises = db.query(`
    SELECT COUNT(*) as count FROM workout_exercises 
    WHERE workout_id NOT IN (SELECT id FROM workouts)
    OR exercise_id NOT IN (SELECT id FROM exercises)
  `).get() as { count: number };

  // Orphaned sets (workout_exercise_id doesn't exist)
  const orphanedSets = db.query(`
    SELECT COUNT(*) as count FROM sets 
    WHERE workout_exercise_id NOT IN (SELECT id FROM workout_exercises)
  `).get() as { count: number };

  return {
    orphanedExercises: orphanedExercises.count,
    orphanedWorkoutExercises: orphanedWorkoutExercises.count,
    orphanedSets: orphanedSets.count,
    hasOrphans: orphanedExercises.count > 0 || orphanedWorkoutExercises.count > 0 || orphanedSets.count > 0,
  };
};

export const createCompleteWorkout = (db: Database, userId: string) => {
  const workoutData = {
    date: "2023-10-01",
    name: "Test Workout",
    notes: "Test notes",
  };

  const exerciseData = {
    name: "Test Exercise",
    category: "Test Category",
    code: "E69"
  };

  const setData = {
    reps: 10,
    metric_value: 50,
    notes: "Test set",
  };

  const workout = insertWorkout(db, workoutData, userId);
  const { exercise, workoutExercise } = insertExerciseToWorkout(
    db,
    exerciseData,
    userId,
    workout.id
  );
  const set = insertSet(db, setData, userId, workout.id, exercise.id);

  return {
    workout,
    exercise,
    workoutExercise,
    set,
  };
};

export const createTestUserBiometrics = (
  db: Database, 
  userId: string,
  biometricsData: {
    weight?: number;
    sex?: UserBiometrics["sex"];
    height?: number;
    build?: UserBiometrics["build"];
  } = {}
) => {
  const defaultBiometrics = {
    weight: 75,
    sex: "male" as const,
    height: 180,
    build: "athletic" as const,
    ...biometricsData,
  };
  
  return createUserBiometrics(db, userId, defaultBiometrics);
};