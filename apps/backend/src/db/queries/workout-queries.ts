import { randomUUID } from "crypto";
import { Database } from "bun:sqlite";
import {
  type Workout,
  type WorkoutExercise,
  type WorkoutOverview,
} from "@aevim/shared-types";
import type { WorkoutData, WorkoutWithoutUserId } from "../../types/workout";

export const insertWorkout = (
  db: Database,
  workoutData: WorkoutData,
  userId: string
) => {
  const { date, name, notes } = workoutData;
  const workoutId = randomUUID();
  const workoutQuery = db.query(`
    INSERT INTO workouts (id, user_id, name, notes, date)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id, name, notes, date, created_at
    `);
  const workout = workoutQuery.get(
    workoutId,
    userId,
    name,
    notes || null,
    date
  ) as WorkoutWithoutUserId;

  return workout;
};

export const getWorkoutsByUserId = (db: Database, userId: string) => {
  const userWorkoutsQuery = db.query(`
    SELECT id, name, notes, date, created_at FROM workouts
    WHERE user_id = ?
    ORDER BY date DESC
    `);

  const workoutsArray = userWorkoutsQuery.all(userId) as Workout[];
  return workoutsArray;
};

export const getWorkoutById = (
  db: Database,
  userId: string,
  workoutId: string
) => {
  const userWorkoutQuery = db.query(`
    SELECT id, name, notes, date, created_at FROM workouts
    WHERE user_id = ? AND id = ?
    `);

  const workout = userWorkoutQuery.get(
    userId,
    workoutId
  ) as WorkoutWithoutUserId | null;
  return workout;
};

export const updateWorkoutById = (
  db: Database,
  workoutId: string,
  userId: string,
  updates: Partial<WorkoutData>
) => {
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_key, value]) => value !== undefined)
  );

  const fields = Object.keys(filteredUpdates);
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = Object.values(filteredUpdates);

  const updateQuery = db.query(`
    UPDATE workouts
    SET ${setClause}
    WHERE id = ? AND user_id = ?
    RETURNING id, name, notes, date, created_at
  `);

  const result = updateQuery.get(
    ...values,
    workoutId,
    userId
  ) as WorkoutWithoutUserId | null;

  return result;
};

export const deleteWorkoutById = (
  db: Database,
  workoutId: string,
  userId: string
) => {
  const deleteWorkoutQuery = db.query(`
    DELETE FROM workouts
    WHERE id = ? AND user_id = ?
    RETURNING name, id
    `);

  const deleteWorkout = deleteWorkoutQuery.get(workoutId, userId) as {
    name: string;
    id: string;
  } | null;
  return deleteWorkout;
};

export const getWorkoutExercisesByWorkoutId = (
  db: Database,
  workoutId: string,
  userId: string
) => {
  const workoutExerciseQuery = db.query(`
    SELECT
     workout_exercises.id,
      workout_exercises.workout_id,
      workout_exercises.exercise_id,
      workout_exercises.order_index,
      workout_exercises.notes,
      workout_exercises.created_at,
      exercises.name,
      exercises.category
    FROM workout_exercises
    JOIN exercises ON workout_exercises.exercise_id = exercises.id
    WHERE workout_exercises.workout_id = ?
    AND exercises.user_id = ?
    ORDER BY workout_exercises.order_index
    `);

  const exercises = workoutExerciseQuery.all(
    workoutId,
    userId
  ) as WorkoutExercise[];
  return exercises;
};

export const getWorkoutOverviewByWorkoutId = (
  db: Database,
  workoutId: string,
  userId: string
): WorkoutOverview | null => {
  const workout = getWorkoutById(db, userId, workoutId);
  if (!workout) {
    throw new Error("WORKOUT_NOT_FOUND");
  }

  // Use column aliases to avoid confusion with array indices
  const query = db.query(`
    SELECT
      workout_exercises.id AS we_id,
      workout_exercises.workout_id AS we_workout_id,
      workout_exercises.exercise_id AS we_exercise_id,
      workout_exercises.order_index AS we_order_index,
      workout_exercises.created_at AS we_created_at,
      exercises.name AS ex_name,
      exercises.category AS ex_category,
      sets.id AS set_id,
      sets.reps AS set_reps,
      sets.weight AS set_weight,
      sets.duration AS set_duration,
      sets.order_index AS set_order_index,
      sets.created_at AS set_created_at
    FROM workout_exercises
    JOIN exercises ON workout_exercises.exercise_id = exercises.id
    LEFT JOIN sets ON workout_exercises.id = sets.workout_exercise_id
    WHERE workout_exercises.workout_id = ?
      AND exercises.user_id = ?
    ORDER BY workout_exercises.order_index, sets.order_index
  `);

  const rows = query.all(workoutId, userId) as any[];

  // Group the results by exercise
  const exercisesMap = new Map();

  for (const row of rows) {
    const exerciseId = row.we_id;

    if (!exercisesMap.has(exerciseId)) {
      exercisesMap.set(exerciseId, {
        id: row.we_id,
        workout_id: row.we_workout_id,
        exercise_id: row.we_exercise_id,
        order_index: row.we_order_index,
        created_at: row.we_created_at,
        name: row.ex_name,
        category: row.ex_category,
        sets: [],
      });
    }

    if (row.set_id) {
      exercisesMap.get(exerciseId).sets.push({
        id: row.set_id,
        workout_exercise_id: row.we_id,
        reps: row.set_reps,
        weight: row.set_weight,
        duration: row.set_duration,
        order_index: row.set_order_index,
        created_at: row.set_created_at,
      });
    }
  }

  return {
    workout,
    exercises: Array.from(exercisesMap.values()),
  };
};