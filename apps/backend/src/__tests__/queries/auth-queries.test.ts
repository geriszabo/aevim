import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../../test/test-db";
import { getUserByEmail, getUserById, insertUser } from "../../db/queries/auth-queries";


let db: Database;

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});



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

