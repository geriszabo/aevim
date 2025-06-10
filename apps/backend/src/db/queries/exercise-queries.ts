import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import type { ExerciseData, ExerciseWithouthUserId } from "../../types/exercise";

export const insertExerciseToWorkout = (
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
  const workout = workoutQuery.get(
    exerciseId,
    userId,
    name,
    category || null
  ) as ExerciseWithouthUserId;

  return workout;
};
