import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import app from "../../index";
import { addWorkoutRequest } from "../../test/test-request-helpers";
import {
  createCompleteWorkoutAndReturn,
  createExerciseAddToWorkoutAndReturn,
  createSetAddToWorkoutAndReturn,
  createWorkoutAndReturn,
  deleteExerciseFromWorkoutAndReturn,
  deleteWorkoutAndReturn,
  getAllExercisesOfWorkoutAndReturn,
  getAllWorkoutsAndReturn,
  getSingleWorkoutAndReturn,
  getWorkoutOverviewAndReturn,
  loginFlow,
  updateSetAndReturn,
  updateWorkoutAndReturn,
} from "../../test/test-helpers";
import type { ExerciseWithouthUserId } from "../../types/exercise";

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

describe("/workouts endpoint", () => {
  it("returns errors if no auth token is provided", async () => {
    await loginFlow();
    const req = addWorkoutRequest({});
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });

  describe("GET /workouts", () => {
    it("returns all workouts for the authenticated user", async () => {
      const { cookie } = await loginFlow();
      // Create two workouts
      await createCompleteWorkoutAndReturn(cookie!);
      await createCompleteWorkoutAndReturn(cookie!);
      const { workouts, workoutsRes } = await getAllWorkoutsAndReturn(cookie!);
      expect(workoutsRes.status).toBe(200);
      expect(workouts.workouts).toHaveLength(2);
      workouts.workouts.forEach((workout) => {
        expect(workout).toEqual({
          id: expect.any(String),
          name: "Monday Workout",
          notes: "Great session",
          date: "2025-08-27",
          created_at: expect.any(String),
        });
      });
    });

    it("returns an empty array if user has no workouts", async () => {
      const { cookie } = await loginFlow();
      const { workouts, workoutsRes } = await getAllWorkoutsAndReturn(cookie!);
      expect(workoutsRes.status).toBe(200);
      expect(workouts).toEqual({
        workouts: [],
      });
    });
  });

  describe("DELETE /completeWorkouts/:id", () => {
    it("deletes a workout by id for the authenticated user", async () => {
      const { cookie } = await loginFlow();
      const { completeWorkout, res } = await createCompleteWorkoutAndReturn(
        cookie!
      );
      if (!res.ok) return;

      const { workout } = completeWorkout.workout;
      const { deleteRes, deletedWorkout } = await deleteWorkoutAndReturn(
        cookie!,
        workout.id
      );
      expect(deleteRes.status).toBe(200);
      expect(deletedWorkout).toEqual({
        message: "Workout has been deleted successfuly",
      });
      const { overviewRes: foundWorkoutRes, overview: foundWorkout } =
        await getWorkoutOverviewAndReturn(cookie!, workout.id);
      expect(foundWorkoutRes.status).toBe(404);
      expect(foundWorkout).toEqual({
        errors: ["Workout not found"],
      });
    });

    it("returns 404 if workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const { deleteRes, deletedWorkout } = await deleteWorkoutAndReturn(
        cookie!,
        "imaginaryWorkoutId"
      );
      expect(deleteRes.status).toBe(404);
      expect(deletedWorkout).toEqual({
        errors: ["Workout not found"],
      });
    });
  });

  describe("GET workouts/:id/overview", () => {
    it("returns a workout with its exercises and sets", async () => {
      const { cookie } = await loginFlow();
      const { completeWorkout, res } = await createCompleteWorkoutAndReturn(
        cookie!
      );
      if (!res.ok) return;

     const {workout} = completeWorkout.workout
      const { overview, success, overviewRes } =
        await getWorkoutOverviewAndReturn(cookie!, workout.id);

      if (success) {
        expect(overviewRes.status).toBe(200);
        expect(overview.workout).toEqual({
          id: workout.id,
          name: "Monday Workout",
          date: "2025-08-27",
          notes: "Great session",
          created_at: expect.any(String),
        });

        expect(overview.exercises).toHaveLength(1);
        expect(overview.exercises[0]!.name).toBe("Bench Press");
        expect(overview.exercises[0]!.sets).toHaveLength(2);
       
      }
    });

    it("returns 404 when workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const { overview, overviewRes } = await getWorkoutOverviewAndReturn(
        cookie!,
        "fakeWorkoutId"
      );
      expect(overviewRes.status).toBe(404);
      expect(overview).toEqual({
        errors: ["Workout not found"],
      });
    });
  });
});
