import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import type {
  ExerciseData,
  ExerciseWithouthUserId,
} from "../../types/exercise";
import type { ExerciseToWorkout } from "@aevim/shared-types";
import { checkItemExists } from "../../helpers";

type InsertExerciseResult = {
  exercise: ExerciseWithouthUserId;
  workoutExercise: ExerciseToWorkout;
};

export const getWorkoutExercisesByWorkoutId = (
  db: Database,
  workoutId: string
) => {
  const workoutExercisesQuery = db.query(
    `
    SELECT 
      exercises.id,
      exercises.name,
      exercises.category,
      workout_exercises.order_index,
        exercises.created_at
    FROM workout_exercises
    JOIN exercises ON workout_exercises.exercise_id = exercises.id
    WHERE workout_exercises.workout_id = ?
    ORDER BY workout_exercises.order_index
  `
  );
  const workoutExercisesArray = workoutExercisesQuery.all(workoutId);
  return workoutExercisesArray;
};

export const insertExerciseToWorkout = (
  db: Database,
  exerciseData: ExerciseData,
  userId: string,
  workoutId: string
): InsertExerciseResult => {
  checkItemExists(db, "workouts", { id: workoutId, user_id: userId });
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
      ) as ExerciseToWorkout;

    return { exercise, workoutExercise };
  });

  return transaction();
};

export const deleteExerciseFromWorkout = (
  db: Database,
  workoutId: string,
  exerciseId: string,
  userId: string
) => {
  const workoutExerciseQuery = db.query(`
      DELETE from workout_exercises
      WHERE workout_id = ? AND exercise_id = ?
      AND workout_id IN (SELECT id FROM workouts WHERE user_id = ?)
      RETURNING id, workout_id, exercise_id
    `);

  const deletedWorkoutExercise = workoutExerciseQuery.get(
    workoutId,
    exerciseId,
    userId
  ) as { id: string; workout_id: string; exercise_id: string } | null;
  return deletedWorkoutExercise;
};
