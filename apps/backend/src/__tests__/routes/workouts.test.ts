import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb } from "../../test/test-db";
import app from "../../index";
import {
  addExerciseToWorkoutRequest,
  addWorkoutRequest,
  deleteExerciseFromWorkoutRequest,
  deleteWorkoutRequest,
  getAllWorkoutsRequest,
  getExercisesByWorkoutIdRequest,
  getSingleWorkoutRequest,
  updateWorkoutRequest,
  type AddWorkoutRequestProps,
} from "../../test/test-request-helpers";
import type { WorkoutWithoutUserId } from "../../types/workout";
import type { Workout, WorkoutExercise } from "@aevim/shared-types";
import type { ExerciseWithouthUserId } from "../../types/exercise";
import { loginFlow } from "../../test/test-helpers";

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
      const req = addWorkoutRequest({ cookie: cookie! });
      const res = await app.fetch(req);
      const json = await res.json();
      expect(cookie).toMatch(/authToken=([^;]+)/);
      expect(res.status).toBe(201);
      expect(json).toEqual({
        message: "Workout created successfully",
        workout: {
          id: expect.any(String),
          name: "crossfit session",
          date: "2022.08.25",
          created_at: expect.any(String),
          notes: "im dead",
        },
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

      await app.fetch(addWorkoutRequest({ cookie: cookie! }));
      await app.fetch(addWorkoutRequest({ cookie: cookie! }));

      const req = getAllWorkoutsRequest(cookie!);
      const res = await app.fetch(req);
      const json = (await res.json()) as { workouts: WorkoutWithoutUserId[] };

      expect(res.status).toBe(200);
      expect(json.workouts).toHaveLength(2);
      json.workouts.forEach((workout) => {
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

      const req = getAllWorkoutsRequest(cookie!);
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        workouts: [],
      });
    });
  });

  describe("GET /workouts/:id", async () => {
    it("returns a workout based  on the workoutId", async () => {
      const { cookie } = await loginFlow();
      const workoutRes = await app.fetch(
        addWorkoutRequest({ cookie: cookie! })
      );
      const workoutJson = (await workoutRes.json()) as {
        message: string;
        workout: WorkoutWithoutUserId;
      };
      const { workout } = workoutJson;

      const req = getSingleWorkoutRequest(workout.id, cookie!);
      const res = await app.fetch(req);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json).toEqual({
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

      const req = getSingleWorkoutRequest("invalidWorkoutId", cookie!);
      const res = await app.fetch(req);
      const json = await res.json();
      expect(res.status).toBe(404);
      expect(json).toEqual({
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
      const workoutRequest = addWorkoutRequest({ cookie: cookie! });
      const workoutResponse = await app.fetch(workoutRequest);
      const { workout } = (await workoutResponse.json()) as {
        workout: WorkoutWithoutUserId;
      };
      expect(workout).toEqual({
        name: "crossfit session",
        notes: "im dead",
        date: "2022.08.25",
        id: expect.any(String),
        created_at: expect.any(String),
      });

      const updateRequest = updateWorkoutRequest(workout.id, update, cookie!);
      const updateResponse = await app.fetch(updateRequest);
      const updateJson = await updateResponse.json();
      expect(updateResponse.status).toBe(200);
      expect(updateJson).toEqual({
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
      const workoutRequest = addWorkoutRequest({ cookie: cookie! });
      const workoutResponse = await app.fetch(workoutRequest);
      const { workout } = (await workoutResponse.json()) as {
        workout: WorkoutWithoutUserId;
      };

      // Define partial updates and expected results
      const partialUpdates = [
        { date: "updated date" },
        { name: "updated name" },
        { notes: "updated notes" },
      ];

      for (const partialUpdate of partialUpdates) {
        const updateRequest = updateWorkoutRequest(
          workout.id,
          partialUpdate,
          cookie!
        );
        const updateResponse = await app.fetch(updateRequest);
        const updateJson = await updateResponse.json();

        expect(updateResponse.status).toBe(200);
        expect(updateJson).toEqual({
          message: "Workout updated successfully",
          workout: {
            ...workout,
            ...partialUpdate,
            created_at: expect.any(String),
            id: workout.id,
          },
        });

        Object.assign(workout, partialUpdate);
      }
    });

    it("returns 400 if no update data is provided", async () => {
      const { cookie } = await loginFlow();
      const workoutRes = await app.fetch(
        addWorkoutRequest({ cookie: cookie! })
      );
      const { workout } = (await workoutRes.json()) as {
        workout: WorkoutWithoutUserId;
      };
      const updateRequest = updateWorkoutRequest(workout.id, {}, cookie!);
      const updateResponse = await app.fetch(updateRequest);
      const updateJson = await updateResponse.json();
      expect(updateResponse.status).toBe(400);
      expect(updateJson).toEqual({
        errors: ["At least one field must be provided"],
      });
    });

    it("returns 400 if update data is invalid", async () => {
      const { cookie } = await loginFlow();
      const workoutRes = await app.fetch(
        addWorkoutRequest({ cookie: cookie! })
      );
      const { workout } = (await workoutRes.json()) as {
        workout: WorkoutWithoutUserId;
      };
      const updateRequest = updateWorkoutRequest(
        workout.id,
        {
          name: null as unknown as string,
          date: null as unknown as string,
          notes: null as unknown as string,
        },
        cookie!
      );
      const updateResponse = await app.fetch(updateRequest);
      const updateJson = await updateResponse.json();
      expect(updateResponse.status).toBe(400);
      expect(updateJson).toEqual({
        errors: [
          "No string for name update provided",
          "No string for date update provided",
          "No string for notes update provided",
        ],
      });
    });

    it("returns 404 if workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const updateRequest = updateWorkoutRequest(
        "nonexistentId",
        { name: "test" },
        cookie!
      );
      const updateResponse = await app.fetch(updateRequest);
      const updateJson = await updateResponse.json();
      expect(updateResponse.status).toBe(404);
      expect(updateJson).toEqual({
        errors: ["Workout not found"],
      });
    });
  });

  describe("DELETE /workouts/:id", () => {
    it("deletes a workout by id for the authenticated user", async () => {
      const { cookie } = await loginFlow();
      // Create a workout
      const workoutRes = await app.fetch(
        addWorkoutRequest({ cookie: cookie! })
      );
      const { workout } = (await workoutRes.json()) as {
        workout: WorkoutWithoutUserId;
      };
      const deleteReq = deleteWorkoutRequest(workout.id, cookie!);
      const deleteRes = await app.fetch(deleteReq);
      const deleteJson = await deleteRes.json();
      expect(deleteRes.status).toBe(200);
      expect(deleteJson).toEqual({
        message:
          "Workout with name: crossfit session as been deleted successfuly",
      });

      const findWorkoutRes = await app.fetch(
        getSingleWorkoutRequest(workout.id, cookie!)
      );
      const findworkoutJson = await findWorkoutRes.json();
      expect(findWorkoutRes.status).toBe(404);
      expect(findworkoutJson).toEqual({
        errors: ["Invalid workout id"],
      });
    });

    it("returns 404 if workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const deleteReq = deleteWorkoutRequest("imaginaryWorkoutId", cookie!);
      const deleteRes = await app.fetch(deleteReq);
      const deleteJson = await deleteRes.json();

      expect(deleteRes.status).toBe(404);
      expect(deleteJson).toEqual({
        errors: ["Workout not found"],
      });
    });
  });

  describe("POST /workouts/:id/exercises", () => {
    it("adds an exercise to a workout", async () => {
      const { cookie } = await loginFlow();
      const workoutRes = await app.fetch(
        addWorkoutRequest({ cookie: cookie! })
      );
      const { workout } = (await workoutRes.json()) as {
        workout: WorkoutWithoutUserId;
      };
      const addExerciseReq = addExerciseToWorkoutRequest({
        cookie: cookie!,
        workoutId: workout.id,
      });
      const addExerciseRes = await app.fetch(addExerciseReq);
      const addExerciseJson = await addExerciseRes.json();
      expect(addExerciseJson).toEqual({
        message: "Exercise added to workout successfully",
        exercise: {
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
        },
      });
    });

    it("returns 400 if exercise data is invalid", async () => {
      const { cookie } = await loginFlow();
      await app.fetch(addWorkoutRequest({ cookie: cookie! }));
      const addExerciseReq = addExerciseToWorkoutRequest({
        cookie: cookie!,
        name: null as any,
      });
      const addExerciseRes = await app.fetch(addExerciseReq);
      expect(addExerciseRes.status).toBe(400);
      const json = await addExerciseRes.json();
      expect(json).toEqual({
        errors: ["You have to give the exercise a name"],
      });
    });

    it("returns 404 if workout does not exist", async () => {
      const { cookie } = await loginFlow();
      const addExerciseReq = addExerciseToWorkoutRequest({
        cookie: cookie!,
        workoutId: "fakeWorkoutId",
      });
      const addExerciseRes = await app.fetch(addExerciseReq);
      expect(addExerciseRes.status).toBe(404);
      const json = await addExerciseRes.json();
      expect(json).toEqual({
        errors: ["Workout not found"],
      });
    });

    it("increments order_index for multiple exercises", async () => {
      const { cookie } = await loginFlow();
      const workoutRes = await app.fetch(
        addWorkoutRequest({ cookie: cookie! })
      );
      const { workout } = (await workoutRes.json()) as {
        workout: WorkoutWithoutUserId;
      };

      // first exercise
      await app.fetch(
        addExerciseToWorkoutRequest({ cookie: cookie!, workoutId: workout.id })
      );
      // second exercise
      const addExerciseReq2 = addExerciseToWorkoutRequest({
        cookie: cookie!,
        name: "pull up",
        category: "back",
        workoutId: workout.id,
      });
      const addExerciseRes2 = await app.fetch(addExerciseReq2);
      const addExerciseJson2 = await addExerciseRes2.json();
      expect(addExerciseJson2).toEqual({
        message: "Exercise added to workout successfully",
        exercise: {
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
        },
      });
    });
  });
  describe("DELETE workouts/:id/exercises/:exerciseId", () => {
    it("deletes an exercise from a workout", async () => {
      const { cookie } = await loginFlow();
      const workoutRes = await app.fetch(
        addWorkoutRequest({ cookie: cookie! })
      );
      const { workout } = (await workoutRes.json()) as {
        workout: WorkoutWithoutUserId;
      };
      const { id: workoutId } = workout;

      const exerciseRes = await app.fetch(
        addExerciseToWorkoutRequest({
          cookie: cookie!,
          workoutId,
        })
      );
      const { exercise } = (await exerciseRes.json()) as {
        exercise: ExerciseWithouthUserId;
      };

      const exercisesOfWorkoutRes = await app.fetch(
        getExercisesByWorkoutIdRequest(cookie!, workoutId)
      );
      const { exercises } = (await exercisesOfWorkoutRes.json()) as {
        exercises: WorkoutExercise[];
      };

      expect(exercises.length).toBe(1);
      const deletedExerciseRes = await app.fetch(
        deleteExerciseFromWorkoutRequest(
          cookie!,
          workoutId,
          exercises[0]!.exercise_id
        )
      );
      const deletedExercise = await deletedExerciseRes.json();
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
  });

  it("returns 404 if the exercise is not in the workout", async () => {
    const { cookie } = await loginFlow();
    const workoutRes = await app.fetch(addWorkoutRequest({ cookie: cookie! }));
    const { workout } = (await workoutRes.json()) as { workout: Workout };
    const fakeExerciseId = "non-existent-exercise";
    const res = await app.fetch(
      deleteExerciseFromWorkoutRequest(cookie!, workout.id, fakeExerciseId)
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ errors: ["Exercise not found in workout"] });
  });
});
