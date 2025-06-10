import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../test/test-db";
import app from "../index";
import {
  addExerciseRequest,
  loginFlow,
  type AddExerciseRequestProps,
} from "../test/test-helpers";

let db: Database;

mock.module("../db/db.ts", () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
});
afterEach(() => {
  db.close();
});

describe("/exercises endpoint", () => {
  it("returns errors if no auth token is provided", async () => {
    await loginFlow();
    const req = addExerciseRequest({});
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });

  describe("POST /exercises", () => {
    it("creates an exercise", async () => {
      const { cookie } = await loginFlow();
      const req = addExerciseRequest({ cookie: cookie! });
      const res = await app.fetch(req);
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(json).toEqual({
        message: "exercise created successfully",
        exercise: {
          id: expect.any(String),
          name: "bench pressing",
          category: "chest",
          created_at: expect.any(String),
        },
      });
    });

    it("returns 400 if parameters are invalid", async () => {
      const { cookie } = await loginFlow();
      const req = addExerciseRequest({
        cookie: cookie!,
        name: null,
        category: null,
      } as unknown as AddExerciseRequestProps);
      const res = await app.fetch(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json).toEqual({
        errors: ["You have to give the exercise a name"],
      });
    });
  });
});
