import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../test/test-db";
import {
  getUserByEmail,
  getUserById,
  getUserWorkouts,
  insertUser,
  insertWorkout,
} from "./queries";
import type { WorkoutData } from "../types/workout";
import type { Workout } from "@aevim/shared-types";

let db: Database;

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

const workoutData: WorkoutData = {
  date: "now",
  name: "gym session",
  notes: "just a couple of notes",
};

describe("insertUser", () => {
  it("inserts user", async () => {
    const email = "test@gmail.com";
    const password = "password123";
    const userId = await insertUser(db, email, password);
    expect(userId).toBeDefined();
  });

  it("throws error if the user email is already taken", async () => {
    const email = "test@gmail.com";
    const password = "password123";
    await insertUser(db, email, password);
    try {
      await insertUser(db, email, password);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/UNIQUE constraint failed/);
      }
    }
  });
  it("throws an error if password is empty", async () => {
    const email = "testtest.com";
    const password = "";
    try {
      await insertUser(db, email, password);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/password must not be empty/);
      }
    }
  });
});

describe("getUsersByEmail", () => {
  it("returns user by email", async () => {
    const email = "test@test.com";
    const password = "password123";
    await insertUser(db, email, password);
    const user = getUserByEmail(db, email);
    expect(user).toEqual({
      id: expect.any(String),
      password_hash: expect.any(String),
    });
  });

  it("returns null if user does not exist", async () => {
    const email = "test@test.com";
    const user = getUserByEmail(db, email);
    expect(user).toBeNull();
  });
});

describe("getUsersById", () => {
  it("returns user by id", async () => {
    const email = "test@test.com";
    const password = "password123";
    const userId = await insertUser(db, email, password);
    const user = getUserById(db, userId);
    expect(user).toEqual({
      id: expect.any(String),
      email: "test@test.com",
    });
  });

  it("returns null if user does not exist", async () => {
    const user = getUserById(db, "anyId");
    expect(user).toBeNull();
  });
});

describe("insertWorkout", () => {
  it("inserts a workout", async () => {
    const userId = "userId1";
    const workout = await insertWorkout(db, workoutData, userId);
    expect(workout).toEqual({
      id: expect.any(String),
      user_id: userId,
      name: workoutData.name,
      notes: workoutData.notes,
      date: workoutData.date,
      created_at: expect.any(String),
    });
  });

  it("throws error if date or name are missing", async () => {
    const workoutData = {
      date: undefined,
      name: undefined,
    } as unknown as WorkoutData;
    const userId = "userId1";
    try {
      await insertWorkout(db, workoutData, userId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/NOT NULL constraint failed/);
      }
    }
  });
});

describe("getUserWorkouts", () => {
  const userId = "userId1";

  it("returns users workouts", async () => {
    const count = 3;
    for (let i = 0; i < count; i++) {
      await insertWorkout(db, workoutData, userId);
    }
    const workouts = getUserWorkouts(db, userId);
    const expectedWorkout = {
      id: expect.any(String),
      name: "gym session",
      created_at: expect.any(String),
      date: "now",
      notes: "just a couple of notes",
    };

    expect(workouts).toHaveLength(count);
    workouts.forEach((workout) => {
      expect(workout).toMatchObject(expectedWorkout);
    });
  });

  it("returns [] if user does not have any logged workouts", async () => {
    const workouts = getUserWorkouts(db, userId);
    expect(workouts).toEqual([]);
  });

  it("does not return workouts belonging to other users", async () => {
  await insertWorkout(db, workoutData, userId);
  await insertWorkout(db, workoutData, userId);
  await insertWorkout(db, workoutData, "differentUser");
  const workouts = getUserWorkouts(db, userId);
  const differentUserWorkouts = workouts.filter(workout => workout.user_id === "differentUser")
  expect(workouts).toHaveLength(2)
  expect(differentUserWorkouts).toHaveLength(0)
  expect(differentUserWorkouts).toEqual([])
});
});
