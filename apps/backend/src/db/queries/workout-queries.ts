import { randomUUID } from "crypto";
import { Database } from "bun:sqlite";
import {
  type Workout,
  type WorkoutData,
  type WorkoutExercise,
  type WorkoutOverview,
  type WorkoutWithoutUserId,
} from "@aevim/shared-types";
import { checkItemExists } from "../../helpers";

export const insertWorkout = (
  db: Database,
  workoutData: WorkoutData,
  userId: string,
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
    date,
  ) as WorkoutWithoutUserId;

  return workout;
};

export const getWorkoutsByUserId = (
  db: Database,
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  },
) => {
  const { limit, offset = 0, startDate, endDate } = options || {};

  const params: (string | number)[] = [userId];

  let whereClause = "WHERE user_id = ?";

  if (startDate) {
    whereClause += " AND date >= ?";
    params.push(startDate);
  }

  if (endDate) {
    whereClause += " AND date <= ?"; // Fixed: was =<, should be
    params.push(endDate);
  }

  let dbString = `SELECT id, name, notes, date, created_at FROM workouts
    ${whereClause}
    ORDER BY date DESC`;

  if (limit !== undefined) {
    // Moved: LIMIT goes after ORDER BY
    dbString += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const userWorkoutsQuery = db.query(dbString);

  const workoutsArray = userWorkoutsQuery.all(...params) as Workout[];
  return workoutsArray;
};

export const getWorkoutById = (
  db: Database,
  userId: string,
  workoutId: string,
) => {
  checkItemExists(db, "workouts", { id: workoutId, user_id: userId });
  const userWorkoutQuery = db.query(`
    SELECT id, name, notes, date, created_at FROM workouts
    WHERE user_id = ? AND id = ?
    `);

  const workout = userWorkoutQuery.get(
    userId,
    workoutId,
  ) as WorkoutWithoutUserId;
  return workout;
};

export const updateWorkoutById = (
  db: Database,
  workoutId: string,
  userId: string,
  updates: Partial<WorkoutData>,
) => {
  checkItemExists(db, "workouts", { id: workoutId, user_id: userId });

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_key, value]) => value !== undefined),
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
    userId,
  ) as WorkoutWithoutUserId | null;

  return result;
};

export const deleteWorkoutById = (
  db: Database,
  workoutId: string,
  userId: string,
) => {
  const transaction = db.transaction(() => {
    //verify the workout exists for the user
    const workout = db
      .query(
        `
      SELECT name, id FROM workouts 
      WHERE id = ? AND user_id = ?
    `,
      )
      .get(workoutId, userId) as { name: string; id: string } | null;

    checkItemExists(db, "workouts", { id: workoutId, user_id: userId });
    //1: Get all exercise IDs for this workout (BEFORE deleting workout_exercises)
    const exerciseIds = db
      .query(
        `
      SELECT exercise_id FROM workout_exercises 
      WHERE workout_id = ?
    `,
      )
      .all(workoutId) as { exercise_id: string }[];
    //2: Delete all sets for this workout
    db.query(
      `
      DELETE FROM sets 
      WHERE workout_exercise_id IN (
        SELECT id FROM workout_exercises 
        WHERE workout_id = ?
      )
    `,
    ).run(workoutId);
    //3: Delete all workout_exercises for this workout
    db.query(
      `
      DELETE FROM workout_exercises 
      WHERE workout_id = ?
    `,
    ).run(workoutId);
    //4: Delete all exercises that belonged to this workout
    for (const { exercise_id } of exerciseIds) {
      db.query(
        `
        DELETE FROM exercises 
        WHERE id = ? AND user_id = ?
      `,
      ).run(exercise_id, userId);
    }
    //5: Delete the workout itself
    db.query(
      `
      DELETE FROM workouts 
      WHERE id = ? AND user_id = ?
    `,
    ).run(workoutId, userId);

    return workout;
  });

  return transaction();
};

export const getExercisesByWorkoutId = (
  db: Database,
  workoutId: string,
  userId: string,
) => {
  checkItemExists(db, "workouts", { id: workoutId, user_id: userId });

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
    userId,
  ) as WorkoutExercise[];
  return exercises;
};

export const getCompleteWorkoutByWorkoutId = (
  db: Database,
  workoutId: string,
  userId: string,
): WorkoutOverview => {
  checkItemExists(db, "workouts", { id: workoutId, user_id: userId });
  const workout = getWorkoutById(db, userId, workoutId);

  // Use column aliases to avoid confusion with array indices
  const query = db.query(`
    SELECT
      workout_exercises.id AS we_id,
      workout_exercises.workout_id AS we_workout_id,
      workout_exercises.exercise_id AS we_exercise_id,
      workout_exercises.order_index AS we_order_index,
      workout_exercises.created_at AS we_created_at,
      exercises.name AS ex_name,
      exercises.metric AS ex_metric,
      exercises.category AS ex_category,
      exercises.code AS ex_code,
      sets.id AS set_id,
      sets.reps AS set_reps,
      sets.metric_value AS set_metric_value,
      sets.order_index AS set_order_index,
      sets.created_at AS set_created_at
    FROM workout_exercises
    JOIN exercises ON workout_exercises.exercise_id = exercises.id
    LEFT JOIN sets ON workout_exercises.id = sets.workout_exercise_id
    WHERE workout_exercises.workout_id = ?
      AND exercises.user_id = ?
    ORDER BY workout_exercises.order_index, sets.order_index
  `);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        metric: row.ex_metric,
        code: row.ex_code,
        sets: [],
      });
    }

    if (row.set_id) {
      exercisesMap.get(exerciseId).sets.push({
        id: row.set_id,
        workout_exercise_id: row.we_id,
        reps: row.set_reps,
        metric_value: row.set_metric_value,
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

export const getWorkoutExerciseAndSetIds = (
  db: Database,
  workoutId: string,
  userId: string,
) => {
  checkItemExists(db, "workouts", { id: workoutId, user_id: userId });

  const query = db.query(`
    SELECT
      workout_exercises.exercise_id AS exercise_id,
      sets.id AS set_id
    FROM workout_exercises
    JOIN exercises ON workout_exercises.exercise_id = exercises.id
    LEFT JOIN sets ON workout_exercises.id = sets.workout_exercise_id
    WHERE workout_exercises.workout_id = ?
      AND exercises.user_id = ?
    ORDER BY workout_exercises.order_index, sets.order_index
  `);

  const rows = query.all(workoutId, userId) as {
    exercise_id: string;
    set_id: string | null;
  }[];

  // Group sets by exercise
  const exerciseMap = new Map<string, string[]>();
  rows.forEach((row) => {
    if (!exerciseMap.has(row.exercise_id)) {
      exerciseMap.set(row.exercise_id, []);
    }
    // Only add set_id if it exists (LEFT JOIN can return null)
    if (row.set_id) {
      exerciseMap.get(row.exercise_id)!.push(row.set_id);
    }
  });

  // Convert to array format that's easy to map through
  return Array.from(exerciseMap.entries()).map(([exerciseId, setIds]) => ({
    exerciseId,
    setIds,
  }));
};
