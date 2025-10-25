import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import type { ExerciseWithouthUserId } from "../../types/exercise";
import { checkItemExists } from "../../helpers";
import type { ExerciseData } from "@aevim/shared-types/schemas/exercise-schema";

export const insertExercise = (
  db: Database,
  exerciseData: ExerciseData,
  userId: string
) => {
  const { name, category, metric } = exerciseData;
  const exerciseId = randomUUID();
  const workoutQuery = db.query(`
    INSERT INTO exercises (id, user_id, name, category, metric)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id, name, category, metric, created_at
    `);
  const exercise = workoutQuery.get(
    exerciseId,
    userId,
    name,
    category || null,
    metric || null
  ) as ExerciseWithouthUserId;

  return exercise;
};

export const deleteExerciseById = (
  db: Database,
  exerciseId: string,
  userId: string
) => {
  const transaction = db.transaction(() => {
    // Verify the exercise exists for the user
    const exercise = db
      .query(
        `
      SELECT name, id FROM exercises 
      WHERE id = ? AND user_id = ?
    `
      )
      .get(exerciseId, userId) as { name: string; id: string } | null;
    checkItemExists(db, "exercises", { id: exerciseId, user_id: userId });

    //1: Delete all sets for this exercise
    db.query(
      `
      DELETE FROM sets 
      WHERE workout_exercise_id IN (
        SELECT id FROM workout_exercises 
        WHERE exercise_id = ?
      )
    `
    ).run(exerciseId);

    //2: Delete all workout_exercises for this exercise
    db.query(
      `
      DELETE FROM workout_exercises 
      WHERE exercise_id = ?
    `
    ).run(exerciseId);

    //3: Delete the exercise itself
    db.query(
      `
      DELETE FROM exercises 
      WHERE id = ? AND user_id = ?
    `
    ).run(exerciseId, userId);

    return exercise;
  });

  return transaction();
};

export const getExerciseById = (
  db: Database,
  exerciseId: string,
  userId: string
) => {
  const exerciseQuery = db.query(`
    SELECT id, name, category, created_at, metric
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
    SELECT id, name, category, created_at, metric
    FROM exercises 
    WHERE user_id = ?`);

  const exercises = exercisesQuery.all(userId) as
    | ExerciseWithouthUserId[]
    | null;

  if (!exercises) {
    throw new Error("NO_EXERCISES_FOUND");
  }
  return exercises;
};

export const updateExerciseById = (
  db: Database,
  exerciseId: string,
  userId: string,
  updates: Partial<ExerciseData>
) => {
  const exerciseExists = db
    .query(
      `
    SELECT id FROM exercises WHERE id = ? AND user_id = ?
  `
    )
    .get(exerciseId, userId);

  if (!exerciseExists) {
    throw new Error("EXERCISE_NOT_FOUND");
  }

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_key, value]) => value !== undefined)
  );

  const fields = Object.keys(filteredUpdates);
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = Object.values(filteredUpdates);

  const updateQuery = db.query(`
      UPDATE exercises
      SET ${setClause}
      WHERE id = ? AND user_id = ?
      RETURNING id, name, category, created_at
    `);

  const result = updateQuery.get(...values, exerciseId, userId);

  return result;
};
