import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { createTestDb } from "../../test/test-db";
import { insertexercise } from "./exercise-queries";
import type { ExerciseData } from "../schemas/exercise-shema";

let db: Database;

beforeEach(() => {
  db = createTestDb();
});

afterEach(() => {
  db.close();
});

describe("insertexercise", () => {
  const userId = "szabogeri69";
  it("inserts exercise", async () => {
    const exerciseData = {
      name: "Push Up",
      category: "Strength",
    };

    const exercise = insertexercise(db, exerciseData, userId);
    expect(exercise).toBeDefined();
    expect(exercise).toEqual({
      id: expect.any(String),
      name: "Push Up",
      category: "Strength",
      created_at: expect.any(String),
    });
  });

  it("inserts exercise with no category", async () => {
    const exerciseData = {
      name: "Push Up",
    };

    const exercise = insertexercise(db, exerciseData, userId);
    expect(exercise).toBeDefined();
    expect(exercise).toEqual({
      id: expect.any(String),
      name: "Push Up",
      category: null,
      created_at: expect.any(String),
    });
  });

  it("throws error when name is missing", () => {
    const exerciseData = {
      category: "Strength",
    } as ExerciseData;
    try {
      insertexercise(db, exerciseData, userId);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/NOT NULL constraint failed/);
      }
    }
  })
});
