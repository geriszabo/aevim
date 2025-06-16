import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import app from "../../index";
import {
  addExerciseRequest,
} from "../../test/test-request-helpers";
import {
  createExerciseAndReturn,
  deleteExerciseAndReturn,
  getAllExercisesAndReturn,
  loginFlow,
} from "../../test/test-helpers";

let db: Database;

mock.module("../../db/db.ts", () => {
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
      const { exerciseRes, exercise } = await createExerciseAndReturn(cookie!);

      expect(exerciseRes.status).toBe(201);
      expect(exercise).toEqual({
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
      const { exerciseRes, exercise } = await createExerciseAndReturn(cookie!, {
        category: null as any,
        name: null as any,
      });

      expect(exerciseRes.status).toBe(400);
      expect(exercise).toEqual({
        errors: ["You have to give the exercise a name"],
      });
    });
  });

  describe("DELETE /exercises/:id", () => {
    it("deletes an exercise", async () => {
      const { cookie } = await loginFlow();
      const { exercise } = await createExerciseAndReturn(cookie!);
      expect(exercise).toEqual({
        message: "exercise created successfully",
        exercise: {
          id: expect.any(String),
          name: "bench pressing",
          category: "chest",
          created_at: expect.any(String),
        },
      });
      const { exercises: exercisesBefore } = await getAllExercisesAndReturn(
        cookie!
      );
      expect(exercisesBefore).toHaveLength(1);
      await deleteExerciseAndReturn(cookie!, exercisesBefore[0]!.id);
      const { exercises: exercisesAfter } = await getAllExercisesAndReturn(
        cookie!
      );
      expect(exercisesAfter).toEqual([]);
    });

    it("returns 404 if exercise not found", async () => {
      const { cookie } = await loginFlow();
      const { deletedExercise, deletedExerciseRes } =
        await deleteExerciseAndReturn(cookie!, "non-existing-id");
      expect(deletedExerciseRes.status).toBe(404);

      expect(deletedExercise).toEqual({
        errors: ["Exercise not found"],
      });
    });
  });
});
