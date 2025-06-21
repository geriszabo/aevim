import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb, createTestUser } from "../../test/test-db";
import {
  getUserByEmail,
  getUserById,
  insertUser,
} from "../../db/queries/auth-queries";

let db: Database;
let userId: string;

beforeEach(() => {
  db = createTestDb();
  userId = createTestUser(db);
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
    expect(userId).toEqual(expect.any(String));
  });

  it("hashes the password correctly", async () => {
    const email = "test@gmail.com";
    const password = "password123";
    await insertUser(db, email, password);

    const user = getUserByEmail(db, email);
    expect(user.password_hash).toBeDefined();
    expect(user.password_hash).not.toBe(password);
    expect(user.password_hash.length).toBeGreaterThan(password.length);
  });

  it("throws EMAIL_ALREADY_EXISTS if email is already taken", async () => {
    const email = "test@gmail.com";
    const password = "password123";
    await insertUser(db, email, password);

    expect(insertUser(db, email, password)).rejects.toThrow(
      "EMAIL_ALREADY_EXISTS"
    );
  });

  it("treats emails as case-insensitive", async () => {
    const email1 = "test@gmail.com";
    const email2 = "Test@Gmail.Com";
    const password = "password123";

    try {
      await insertUser(db, email1, password);
      await insertUser(db, email2, password);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/EMAIL_ALREADY_EXISTS/);
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

it("stores email in lowercase", async () => {
  const email = "TunaSandwich@GmAiL.cOm";
  const password = "password123";
  
  const userId = await insertUser(db, email, password);
  const user = getUserById(db, userId);
  
  expect(user.email).toBe("tunasandwich@gmail.com");
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
    try {
      getUserByEmail(db, "test@test.com");
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/INVALID_CREDENTIALS/);
      }
    }
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
    try {
      getUserById(db, "anyId");
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/USER_NOT_FOUND/);
      }
    }
  });
});
