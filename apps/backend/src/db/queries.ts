import { type UUID, randomUUID } from "crypto";
import { Database } from "bun:sqlite";
import { type Workout } from "@aevim/shared-types";
import type { WorkoutData, WorkoutWithoutUserId } from "../types/workout";

export const insertUser = async (
  db: Database,
  email: string,
  password: string
) => {
  const userId = randomUUID();
  const passwordHash = await Bun.password.hash(password);

  const insertQuery = db.query(`
        INSERT INTO users (id, email, password_hash)
        VALUES (?, ?, ?)
        RETURNING id
        `);

  const user = insertQuery.get(userId, email, passwordHash) as { id: UUID };
  return user.id;
};

export const getUserByEmail = (db: Database, email: string) => {
  const userQuery = db.query(`
    SELECT id, password_hash FROM users WHERE email = ?
    `);
  const user = userQuery.get(email) as {
    id: string;
    password_hash: string;
  } | null;
  return user;
};

export const getUserById = (db: Database, id: string) => {
  const userQuery = db.query(`
     SELECT id, email FROM users WHERE id = ?
    `);

  const user = userQuery.get(id) as { id: string; email: string } | null;
  return user;
};

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
