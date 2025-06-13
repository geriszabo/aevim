import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import type {
  ExerciseData,
  ExerciseWithouthUserId,
} from "../../types/exercise";
import type { WorkoutExercise } from "@aevim/shared-types";


export const insertExercise = (
  db: Database,
  exerciseData: ExerciseData,
  userId: string
) => {
  const { name, category } = exerciseData;
  const exerciseId = randomUUID();
  const workoutQuery = db.query(`
    INSERT INTO exercises (id, user_id, name, category)
    VALUES (?, ?, ?, ?)
    RETURNING id, name, category, created_at
    `);
  const exercise = workoutQuery.get(
    exerciseId,
    userId,
    name,
    category || null
  ) as ExerciseWithouthUserId;

  return exercise;
};


export const deleteExerciseById = (
  db: Database,
  exerciseId: string,
  userId: string
) => {
  const exerciseQuery = db.query(`
    DELETE FROM exercises
    WHERE id = ? AND user_id = ?
    RETURNING name, id
    `);

  const deletedExercise = exerciseQuery.get(exerciseId, userId) as {
    name: string;
    id: string;
  } | null;

  return deletedExercise;
};

export const getExerciseById = (
  db: Database,
  exerciseId: string,
  userId: string
) => {
  const exerciseQuery = db.query(`
    SELECT id, name, category, created_at
    FROM exercises
    WHERE id = ? AND user_id = ?
    `);

  const exercise = exerciseQuery.get(
    exerciseId,
    userId
  ) as ExerciseWithouthUserId | null;

  return exercise;
};

export const getAllExercises = (db: Database, userId: string) => {
  const exercisesQuery = db.query(`
    SELECT id, name, category, created_at
    FROM exercises 
    WHERE user_id = ?`);

  const exercises = exercisesQuery.all(userId) as
    | ExerciseWithouthUserId[]
    | null;
  return exercises;
};
