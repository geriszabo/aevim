import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import app from "../../index";
import {
  addWorkoutRequest,
  type AddWorkoutRequestProps,
} from "../../test/test-request-helpers";
import {
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

  describe("POST /workouts", () => {
    it("creates a workout", async () => {
      const { cookie } = await loginFlow();
      const { workoutRes, workout } = await createWorkoutAndReturn(cookie!);

      expect(cookie).toMatch(/authToken=([^;]+)/);
      expect(workoutRes.status).toBe(201);
      expect(workout).toEqual({
        id: expect.any(String),
        name: "crossfit session",
        date: "2022.08.25",
        created_at: expect.any(String),
        notes: "im dead",
      });
    });

    it("returns 400 if parameters are invalid", async () => {
      const { cookie } = await loginFlow();
      const req = addWorkoutRequest({
        cookie: cookie!,
        date: null,
        name: null,
        notes: null,
        userId: null,
      } as unknown as AddWorkoutRequestProps);
      const res = await app.fetch(req);
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json).toEqual({
        errors: [
          "You have to give the workout a name",
          "Please pick a date for the workout",
        ],
      });
    });
  });

  describe("GET /workouts", () => {
    it("returns all workouts for the authenticated user", async () => {
      const { cookie } = await loginFlow();
      // Create two workouts
      await createWorkoutAndReturn(cookie!);
      await createWorkoutAndReturn(cookie!);
      const { workouts, workoutsRes } = await getAllWorkoutsAndReturn(cookie!);
      expect(workoutsRes.status).toBe(200);
      expect(workouts.workouts).toHaveLength(2);
      workouts.workouts.forEach((workout) => {
        expect(workout).toEqual({
          id: expect.any(String),
          name: "crossfit session",
          notes: "im dead",
          date: "2022.08.25",
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

  describe("GET /workouts/:id", async () => {
    it("returns a workout based on the workoutId", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { workoutRes, workout: retrievedWorkout } =
        await getSingleWorkoutAndReturn(cookie!, workout.id);
      expect(workoutRes.status).toBe(200);
      expect(retrievedWorkout).toEqual({
        workout: {
          id: workout.id,
          name: "crossfit session",
          notes: "im dead",
          created_at: expect.any(String),
          date: "2022.08.25",
        },
      });
    });

    it("throws error if workoutId is invalid", async () => {
      const { cookie } = await loginFlow();
      const { workoutRes, workout } = await getSingleWorkoutAndReturn(
        cookie!,
        "invalidWorkoutId"
      );
      expect(workoutRes.status).toBe(404);
      expect(workout).toEqual({
        errors: ["Invalid workout id"],
      });
    });
  });

  describe("PUT /workouts/:id", async () => {
    const update = {
      date: "updated date",
      name: "updated name",
      notes: "updated notes",
    };

    it("updates a workout if data is provided", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);

      expect(workout).toEqual({
        name: "crossfit session",
        notes: "im dead",
        date: "2022.08.25",
        id: expect.any(String),
        created_at: expect.any(String),
      });
      const { updateWorkoutRes, updatedWorkout } = await updateWorkoutAndReturn(
        cookie!,
        workout.id,
        update
      );
      expect(updateWorkoutRes.status).toBe(200);
      expect(updatedWorkout).toEqual({
        message: "Workout updated successfully",
        workout: {
          id: workout.id,
          ...update,
          created_at: expect.any(String),
        },
      });
    });

    it("updates a workout with partially provided data", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      // Define partial updates and expected results
      const partialUpdates = [
        { date: "updated date" },
        { name: "updated name" },
        { notes: "updated notes" },
      ];
      const currentWorkout = { ...workout };
      for (const partialUpdate of partialUpdates) {
        const { updateWorkoutRes, updatedWorkout } =
          await updateWorkoutAndReturn(cookie!, workout.id, partialUpdate);

        expect(updateWorkoutRes.status).toBe(200);
        expect(updatedWorkout).toEqual({
          message: "Workout updated successfully",
          workout: {
            ...currentWorkout,
            ...partialUpdate,
            created_at: expect.any(String),
            id: workout.id,
          },
        });

        Object.assign(currentWorkout, partialUpdate);
      }
    });

    it("returns 400 if no update data is provided", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { updateWorkoutRes, updatedWorkout } = await updateWorkoutAndReturn(
        cookie!,
        workout.id,
        {}
      );
      expect(updateWorkoutRes.status).toBe(400);
      expect(updatedWorkout).toEqual({
        errors: ["At least one field must be provided"],
      });
    });

    it("returns 400 if update data is invalid", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);

      const { updatedWorkout, updateWorkoutRes } = await updateWorkoutAndReturn(
        cookie!,
        workout.id,
        {
          name: null as unknown as string,
          date: null as unknown as string,
          notes: null as unknown as string,
        }
      );
      expect(updateWorkoutRes.status).toBe(400);
      expect(updatedWorkout).toEqual({
        errors: [
          "No string for name update provided",
          "No string for date update provided",
          "No string for notes update provided",
        ],
      });
    });

    it("returns 404 if workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const { updateWorkoutRes, updatedWorkout } = await updateWorkoutAndReturn(
        cookie!,
        "nonexistentId",
        { name: "test" }
      );
      expect(updateWorkoutRes.status).toBe(404);
      expect(updatedWorkout).toEqual({
        errors: ["Workout not found"],
      });
    });
  });

  describe("DELETE /workouts/:id", () => {
    it("deletes a workout by id for the authenticated user", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { deleteRes, deletedWorkout } = await deleteWorkoutAndReturn(
        cookie!,
        workout.id
      );
      expect(deleteRes.status).toBe(200);
      expect(deletedWorkout).toEqual({
        message:
          "Workout with name: crossfit session as been deleted successfuly",
      });
      const { workoutRes: foundWorkoutRes, workout: foundWorkout } =
        await getSingleWorkoutAndReturn(cookie!, workout.id);
      expect(foundWorkoutRes.status).toBe(404);
      expect(foundWorkout).toEqual({
        errors: ["Invalid workout id"],
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

  describe("POST /workouts/:id/exercises", () => {
    it("adds an exercise to a workout", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { exercise } = await createExerciseAddToWorkoutAndReturn(
        cookie!,
        workout.id
      );

      expect(exercise).toEqual({
        message: "Exercise added to workout successfully",
        exercise: {
          id: expect.any(String),
          name: "bench pressing",
          category: "chest",
          created_at: expect.any(String),
        },
        workoutExercise: {
          id: expect.any(String),
          workout_id: expect.any(String),
          exercise_id: expect.any(String),
          created_at: expect.any(String),
          order_index: 1,
        },
      });
    });

    it("returns 400 if exercise data is invalid", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const { exercise, exerciseRes } =
        await createExerciseAddToWorkoutAndReturn(cookie!, workout.id, {
          name: null as any,
        });

      expect(exerciseRes.status).toBe(400);
      expect(exercise).toEqual({
        errors: ["You have to give the exercise a name"],
      });
    });

    it("returns 404 if workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const { exerciseRes, exercise } =
        await createExerciseAddToWorkoutAndReturn(cookie!, "fakeWorkoutId");
      expect(exerciseRes.status).toBe(404);
      expect(exercise).toEqual({
        errors: ["Workout not found"],
      });
    });

    it("increments order_index for multiple exercises", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      // first exercise
      await createExerciseAddToWorkoutAndReturn(cookie!, workout.id);
      // second exercise
      const { exercise, exerciseRes } =
        await createExerciseAddToWorkoutAndReturn(cookie!, workout.id, {
          name: "pull up",
          category: "back",
        });
      expect(exercise).toEqual({
        message: "Exercise added to workout successfully",
        exercise: {
          id: expect.any(String),
          name: "pull up",
          category: "back",
          created_at: expect.any(String),
        },
        workoutExercise: {
          id: expect.any(String),
          workout_id: expect.any(String),
          exercise_id: expect.any(String),
          created_at: expect.any(String),
          order_index: 2,
        },
      });
    });
  });

  describe("DELETE workouts/:id/exercises/:exerciseId", () => {
    it("deletes an exercise from a workout", async () => {
      const { cookie } = await loginFlow();
      const {
        workout: { id: workoutId },
      } = await createWorkoutAndReturn(cookie!);
      await createExerciseAddToWorkoutAndReturn(cookie!, workoutId);
      const { exercises } = await getAllExercisesOfWorkoutAndReturn(
        cookie!,
        workoutId
      );
      const { deletedExercise } = await deleteExerciseFromWorkoutAndReturn(
        cookie!,
        workoutId,
        exercises[0]!.exercise_id
      );

      expect(exercises.length).toBe(1);
      expect(deletedExercise).toEqual({
        message: `Exercise with id: ${
          exercises[0]!.exercise_id
        } has been deleted successfully from workout with id: ${workoutId}`,
        exercise: {
          id: expect.any(String),
          workout_id: expect.any(String),
          exercise_id: expect.any(String),
        },
      });
    });
    
    it("returns 404 if the exercise is not in the workout", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);
      const fakeExerciseId = "non-existent-exercise";
      const { deletedExerciseRes, deletedExercise } =
        await deleteExerciseFromWorkoutAndReturn(
          cookie!,
          workout.id,
          fakeExerciseId
        );
      expect(deletedExerciseRes.status).toBe(404);
      expect(deletedExercise).toEqual({
        errors: ["Exercise not found in workout"],
      });
    });
  });

  describe("GET workouts/:id/overview", () => {
    it("returns a workout with its exercises and sets", async () => {
      const { cookie } = await loginFlow();
      const { workout } = await createWorkoutAndReturn(cookie!);

      const exercisesArray = [
        { name: "Bench Press", category: "chest" },
        { name: "Squats", category: "legs" },
      ];

      for (const exercise of exercisesArray) {
        const { exercise: createdExercise } =
          await createExerciseAddToWorkoutAndReturn(
            cookie!,
            workout.id,
            exercise
          );

        const successResponse = createdExercise as {
          exercise: ExerciseWithouthUserId;
        };

        await createSetAddToWorkoutAndReturn(
          cookie!,
          workout.id,
          successResponse.exercise.id,
          { reps: 10, weight: 135 }
        );
        await createSetAddToWorkoutAndReturn(
          cookie!,
          workout.id,
          successResponse.exercise.id,
          { reps: 8, weight: 145 }
        );
      }

      const { overview, success, overviewRes } =
        await getWorkoutOverviewAndReturn(cookie!, workout.id);

      if (success) {
        expect(overviewRes.status).toBe(200);
        expect(overview.workout).toEqual({
          id: workout.id,
          name: "crossfit session",
          date: "2022.08.25",
          notes: "im dead",
          created_at: expect.any(String),
        });

        expect(overview.exercises).toHaveLength(2);
        expect(overview.exercises[0]!.name).toBe("Bench Press");
        expect(overview.exercises[0]!.sets).toHaveLength(2);
        expect(overview.exercises[1]!.name).toBe("Squats");
        expect(overview.exercises[1]!.sets).toHaveLength(2);
      }
    });

    it("returns 404 when workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const { overview, overviewRes } = await getWorkoutOverviewAndReturn(
        cookie!,
        "fakeWorkoutId"
      )
      expect(overviewRes.status).toBe(404);
      expect(overview).toEqual({
        errors: ["Workout not found"],
      });
    });
  });
});
