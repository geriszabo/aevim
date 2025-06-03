import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../test/test-db";
import {
  deleteWorkoutById,
  getUserByEmail,
  getUserById,
  getWorkoutById,
  getWorkoutsByUserId,
  insertUser,
  insertWorkout,
  updateWorkoutById,
} from "./queries";
import type { WorkoutData } from "../types/workout";

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

describe("getWorkoutsByUserId", () => {
  const userId = "userId1";

  it("returns users workouts", async () => {
    const count = 3;
    for (let i = 0; i < count; i++) {
      insertWorkout(db, workoutData, userId);
    }
    const workouts = getWorkoutsByUserId(db, userId);
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
    const workouts = getWorkoutsByUserId(db, userId);
    expect(workouts).toEqual([]);
  });

  it("does not return workouts belonging to other users", async () => {
    insertWorkout(db, workoutData, userId);
    insertWorkout(db, workoutData, userId);
    insertWorkout(db, workoutData, "differentUser");
    const workouts = getWorkoutsByUserId(db, userId);
    const differentUserWorkouts = workouts.filter(
      (workout) => workout.user_id === "differentUser"
    );
    expect(workouts).toHaveLength(2);
    expect(differentUserWorkouts).toHaveLength(0);
    expect(differentUserWorkouts).toEqual([]);
  });
});

describe("getWorkoutById", () => {
  const userId = "userId1";

  it("returns workout with given id", async () => {
    insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    insertWorkout(
      db,
      { date: "tomorrow", name: "workout 2", notes: "note for workout 2" },
      userId
    );
    const workouts = getWorkoutsByUserId(db, userId);
    expect(workouts).toHaveLength(2);
    const firstWorkout = getWorkoutById(db, userId, workouts[1]?.id!);
    expect(firstWorkout).toBeDefined();

    expect(firstWorkout).toEqual({
      id: workouts[1]!.id,
      name: "workout 1",
      notes: "note for workout 1",
      date: "today",
      created_at: expect.any(String),
    });
  });

  it("returns null if workout id is invalid", async () => {
    const workout = getWorkoutById(db, userId, "invalidWorkoutId");
    expect(workout).toBeNull();
  });

  it("returns null if user id is invalid", async () => {
    const workoutId = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    ).id;
    const workout = getWorkoutById(db, "invalidUserId", workoutId);
    expect(workout).toBeNull();
  });
});

describe("updateWorkoutById", () => {
  const userId = "userId1";

  const updatesArray = [
    { name: "updated name only" },
    { date: "updated date only" },
    { notes: "updated notes only" },
    { name: "new name", date: "new date" },
    { name: "new name", date: "new date", notes: "new notes too" },
  ];

  it("updates a workout with given data", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    const updatedFields = {
      date: "updated date",
      name: "updated workout name",
      notes: "updated note",
    };
    const updatedWorkout = updateWorkoutById(
      db,
      workout.id,
      userId,
      updatedFields
    );
    expect(updatedWorkout).toEqual({
      ...updatedFields,
      created_at: expect.any(String),
      id: expect.any(String),
    });
  });

  it("updates only the data that is to be updated", async () => {
    updatesArray.forEach((update) => {
      const workout = insertWorkout(
        db,
        { date: "today", name: "workout 1", notes: "note for workout 1" },
        userId
      );
      const updatedWorkout = updateWorkoutById(db, workout.id, userId, update);
      expect(updatedWorkout).toEqual({
        ...workout,
        ...update,
      });
    });
  });

  it("throws error if there is no data to update", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    try {
      const updatedWorkout = updateWorkoutById(db, workout.id, userId, {});
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/near \"WHERE\": syntax error/);
      }
    }
  });

  it("throws error if update data is undefined or null", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      userId
    );
    try {
      updateWorkoutById(db, workout.id, userId, {
        date: null as unknown as undefined,
        name: null as unknown as undefined,
      });
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/NOT NULL constraint failed/);
      }
    }
  });

  it("returns null when trying to update another user's workout", async () => {
    const workout = insertWorkout(
      db,
      { date: "today", name: "workout 1", notes: "note for workout 1" },
      "user1"
    );

    const result = updateWorkoutById(db, workout.id, "user2", {
      name: "hacked",
    });
    expect(result).toBeNull();
  });

  describe("deleteWorkoutById", () => {
    const userId = "userId1";

    it("deletes a workout by id and userId", async () => {
      const workout = insertWorkout(
        db,
        { date: "2024-06-01", name: "delete me", notes: "to be deleted" },
        userId
      );
      const deleted = deleteWorkoutById(db, workout.id, userId);
      expect(deleted).toEqual({
        id: workout.id,
        name: "delete me",
      });

      const retryFindingWorkout = getWorkoutById(db, userId, workout.id);
      expect(retryFindingWorkout).toBeNull();
    });

    it("returns null if workout does not exist", async () => {
      const deleted = deleteWorkoutById(db, "nonexistent-id", userId);
      expect(deleted).toBeNull();
    });

    it("returns null if workout exists but belongs to another user", async () => {
      const workout = insertWorkout(
        db,
        { date: "2024-06-01", name: "not your workout", notes: "nope" },
        "otherUser"
      );
      const deleted = deleteWorkoutById(db, workout.id, userId);
      expect(deleted).toBeNull();
      const retryFindingWorkout = getWorkoutById(db, "otherUser", workout.id);
      expect(retryFindingWorkout).not.toBeNull();
    });
  });
});
