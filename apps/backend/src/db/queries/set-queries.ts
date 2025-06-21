import { Database } from "bun:sqlite";
import type { SetData } from "../../types/set";
import { randomUUID } from "crypto";
import type { Set } from "@aevim/shared-types";
import { checkItemExists } from "../../helpers";

export const insertSet = (
  db: Database,
  setData: SetData,
  userId: string,
  workoutId: string,
  exerciseId: string
) => {
  // STEP 1: SECURITY CHECK
  const workoutExerciseExists = db
    .query(
      `
      SELECT workout_exercises.id 
      FROM workout_exercises
      JOIN workouts ON workout_exercises.workout_id = workouts.id
      WHERE workout_exercises.workout_id = ?
        AND workout_exercises.exercise_id = ?
        AND workouts.user_id = ?
    `
    )
    .get(workoutId, exerciseId, userId) as { id: string } | null;

  if (!workoutExerciseExists) {
    throw new Error("WORKOUT_EXERCISE_NOT_FOUND");
  }

  // STEP 2: PREPARE DATA
  const setId = randomUUID();
  const { reps, weight, duration, distance, notes } = setData;

  // STEP 3: GET NEXT ORDER INDEX
  const maxOrder = db
    .query(
      `
      SELECT COALESCE(MAX(order_index), 0) as max_order 
      FROM sets 
      WHERE workout_exercise_id = ?
    `
    )
    .get(workoutExerciseExists.id) as { max_order: number };

  const nextOrder = maxOrder.max_order + 1;

  // STEP 4: INSERT THE SET (matching your schema)
  const setQuery = db.query(`
    INSERT INTO sets (id, workout_exercise_id, reps, weight, duration, distance, notes, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING id, workout_exercise_id, reps, weight, duration, distance, notes, order_index, created_at
  `);

  const set = setQuery.get(
    setId,
    workoutExerciseExists.id,
    reps,
    weight || null,
    duration || null,
    distance || null,
    notes || null,
    nextOrder
  ) as Set;

  return set;
};

export const getAllSetsByExerciseId = (
  db: Database,
  userId: string,
  workoutId: string,
  exerciseId: string
) => {
  checkItemExists(db, "workouts", { id: workoutId, user_id: userId });
  checkItemExists(db, "exercises", { id: exerciseId, user_id: userId });
  checkItemExists(db, "workout_exercises", {
    workout_id: workoutId,
    exercise_id: exerciseId,
  });
  const setsQuery = db.query(`
    SELECT 
      sets.id,
      sets.workout_exercise_id,
      sets.reps,
      sets.weight,
      sets.duration,
      sets.distance,
      sets.notes,
      sets.order_index,
      sets.created_at
    FROM sets
    JOIN workout_exercises ON sets.workout_exercise_id = workout_exercises.id
    JOIN workouts ON workout_exercises.workout_id = workouts.id
    WHERE workout_exercises.workout_id = ? 
      AND workout_exercises.exercise_id = ? 
      AND workouts.user_id = ?
    ORDER BY sets.order_index
  `);

  const sets = setsQuery.all(workoutId, exerciseId, userId) as Set[];
  return sets;
};

export const deleteSetBySetId = (
  db: Database,
  setId: string,
  userId: string
): { id: string } | null => {
  const setExists = db
    .query(
      `
      SELECT sets.id
      FROM sets
      JOIN workout_exercises ON sets.workout_exercise_id = workout_exercises.id
      JOIN workouts ON workout_exercises.workout_id = workouts.id
      WHERE sets.id = ?
        AND workouts.user_id = ?
    `
    )
    .get(setId, userId) as { id: string } | null;

  if (!setExists) {
    throw new Error("SET_NOT_FOUND");
  }

  const deleteSetQuery = db.query(`
    DELETE FROM sets
    WHERE id = ?
    RETURNING id
  `);

  const deletedSet = deleteSetQuery.get(setId) as { id: string } | null;
  return deletedSet;
};

export const updateSetById = (
  db: Database,
  setId: string,
  updates: Partial<SetData>,
  userId: string
) => {
  const setExists = db
    .query(
      `
      SELECT sets.id
      FROM sets
      JOIN workout_exercises ON sets.workout_exercise_id = workout_exercises.id
      JOIN workouts ON workout_exercises.workout_id = workouts.id
      WHERE sets.id = ?
        AND workouts.user_id = ?
    `
    )
    .get(setId, userId) as { id: string } | null;

  if (!setExists) {
    throw new Error("SET_NOT_FOUND");
  }

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_key, value]) => value !== undefined)
  );

  const fields = Object.keys(filteredUpdates);
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = Object.values(filteredUpdates);

  const updateQuery = db.query(`
    UPDATE sets
    SET ${setClause}
    WHERE id = ? 
      AND workout_exercise_id IN (
        SELECT workout_exercises.id 
        FROM workout_exercises
        JOIN workouts ON workout_exercises.workout_id = workouts.id
        WHERE workouts.user_id = ?
      )
    RETURNING id, workout_exercise_id, reps, weight, duration, distance, notes, order_index, created_at
  `);

  const result = updateQuery.get(...values, setId, userId) as Set | null;

  return result;
};
