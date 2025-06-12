import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import type {
  ExerciseData,
  ExerciseWithouthUserId,
} from "../../types/exercise";
import type { WorkoutExercise } from "@aevim/shared-types";

type InsertExerciseResult = {
  exercise: ExerciseWithouthUserId;
  workoutExercise: WorkoutExercise;
};

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

export const insertExerciseToWorkout = (
  db: Database,
  exerciseData: ExerciseData,
  userId: string,
  workoutId: string
): InsertExerciseResult => {
  const workoutExists = db
    .query(`SELECT id FROM workouts WHERE id = ? AND user_id = ?`)
    .get(workoutId, userId);

  if (!workoutExists) {
    throw new Error("WORKOUT_NOT_FOUND");
  }

  const exerciseId = randomUUID();
  const workoutExerciseId = randomUUID();
  const { name, category } = exerciseData;
  const maxOrder = db
    .query(
      `
    SELECT COALESCE(MAX(order_index), 0) as max_order 
    FROM workout_exercises 
    WHERE workout_id = ?
  `
    )
    .get(workoutId) as { max_order: number };

  const nextOrder = maxOrder.max_order + 1;

  const transaction = db.transaction(() => {
    const exercise = db
      .query(
        `
      INSERT INTO exercises (id, user_id, name, category)
      VALUES (?, ?, ?, ?)
      RETURNING id, name, category, created_at
    `
      )
      .get(
        exerciseId,
        userId,
        name,
        category || null
      ) as ExerciseWithouthUserId;

    const workoutExercise = db
      .query(
        `
      INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index)
      VALUES (?, ?, ?, ?)
      RETURNING id, workout_id, exercise_id, order_index, created_at
    `
      )
      .get(
        workoutExerciseId,
        workoutId,
        exerciseId,
        nextOrder
      ) as WorkoutExercise;

    return { exercise, workoutExercise };
  });

  return transaction();
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
