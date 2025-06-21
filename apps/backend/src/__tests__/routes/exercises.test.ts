import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import app from "../../index";
import {
  addExerciseRequest,
} from "../../test/test-request-helpers";
import {
  createExerciseAddToWorkoutAndReturn,
  createExerciseAndReturn,
  createWorkoutAndReturn,
  deleteExerciseAndReturn,
  getAllExercisesAndReturn,
  loginFlow,
  updateExerciseAndReturn,
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

  describe("PUT /exercises/:id", () => {
    it("updates an exercise", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { exercise, success } = await createExerciseAddToWorkoutAndReturn(
        cookie!,
        workout.id
      );
      if (success) {
        const { updatedExercise } = await updateExerciseAndReturn(
          cookie!,
          exercise.exercise.id,
          { name: "updated name", category: "updated category" }
        );
        expect(updatedExercise).toEqual({
          message: "Exercise updated successfully",
          exercise: {
            id: exercise.exercise.id,
            name: "updated name",
            category: "updated category",
            created_at: expect.any(String),
          },
        });
      }
    });

    it("updates only 1 field if needed", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { exercise, success } = await createExerciseAddToWorkoutAndReturn(
        cookie!,
        workout.id
      );
      if (success) {
        const { updatedExercise } = await updateExerciseAndReturn(
          cookie!,
          exercise.exercise.id,
          {
            category: "updated category",
          }
        );
        expect(updatedExercise).toEqual({
          message: "Exercise updated successfully",
          exercise: {
            id: exercise.exercise.id,
            name: "bench pressing",
            category: "updated category",
            created_at: expect.any(String),
          },
        });
        const { updatedExercise: updatedExerciseAgain } =
          await updateExerciseAndReturn(cookie!, exercise.exercise.id, {
            name: "updated name",
          });
        expect(updatedExerciseAgain).toEqual({
          message: "Exercise updated successfully",
          exercise: {
            id: exercise.exercise.id,
            name: "updated name",
            category: "updated category",
            created_at: expect.any(String),
          },
        });
      }
    });

    it("returns 404 if exercise does not exist", async () => {
      const { cookie } = await loginFlow();
      const { updatedExercise, updatedExerciseRes } =
        await updateExerciseAndReturn(cookie!, "non-existent-exercise-id", {
          name: "updated name",
        });

      expect(updatedExerciseRes.status).toBe(404);
      expect(updatedExercise).toEqual({ errors: ["Exercise not found"] });
    });
    it("returns 400 if invalid data is provided", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { exercise, success } = await createExerciseAddToWorkoutAndReturn(
        cookie!,
        workout.id
      );
      if (success) {
        const { updatedExercise, updatedExerciseRes } =
          await updateExerciseAndReturn(cookie!, exercise.exercise.id, {
            name: null,
            category: null,
          } as any);
        expect(updatedExerciseRes.status).toBe(400);
        expect(updatedExercise).toEqual({
          errors: [
            "No string for name update provided",
            "No string for category update provided",
          ],
        });
      }
    });
  });
});
