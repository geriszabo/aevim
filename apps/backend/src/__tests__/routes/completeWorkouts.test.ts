import {
  addCompleteWorkoutRequest,
  updateCompleteWorkoutRequest,
} from "../../test/test-request-helpers";
import { describe, beforeEach, afterEach, expect, mock, it } from "bun:test";
import { Database } from "bun:sqlite";

import { createTestDb, createTestUser } from "../../test/test-db";
import app from "../../index";
import {
  createCompleteWorkoutAndReturn,
  getAuthMeAndReturn,
  getWorkoutOverviewAndReturn,
  loginFlow,
  updateCompleteWorkoutAndReturn,
} from "../../test/test-helpers";
import type { WorkoutOverview } from "@aevim/shared-types";
import { getCompleteWorkoutByWorkoutId } from "../../db/queries/workout-queries";

let db: Database;
let userId: string;

mock.module("../../db/db.ts", () => {
  return { dbConnect: () => db };
});

beforeEach(() => {
  db = createTestDb();
  userId = createTestUser(db);
});
afterEach(() => {
  db.close();
});

const defaultCompleteWorkout: WorkoutOverview = {
  exercises: [
    {
      category: "chest",
      created_at: expect.any(String),
      exercise_id: expect.any(String),
      id: expect.any(String),
      metric: "weight",
      name: "Bench Press",
      order_index: 1,
      sets: [
        {
          created_at: expect.any(String),
          id: expect.any(String),
          metric_value: 135,
          order_index: 1,
          reps: 10,
          workout_exercise_id: expect.any(String),
        },
        {
          created_at: expect.any(String),
          id: expect.any(String),
          metric_value: 145,
          order_index: 2,
          reps: 8,
          workout_exercise_id: expect.any(String),
        },
      ],
      workout_id: expect.any(String),
    },
  ],
  workout: {
    created_at: expect.any(String),
    date: "2025-08-27",
    id: expect.any(String),
    name: "Monday Workout",
    notes: "Great session",
  },
};

describe("/completeWorkouts endpoint", () => {
  it("returns errors if no auth token is provided", async () => {
    await loginFlow();
    const req = addCompleteWorkoutRequest();
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
  });

  describe("POST /completeWorkouts", () => {
    it("creates a complete workout", async () => {
      const { cookie } = await loginFlow();
      const { res, completeWorkout } = await createCompleteWorkoutAndReturn(
        cookie!
      );
      expect(res.status).toBe(200);
      expect(completeWorkout).toEqual({
        message: "Complete workout created successfully",
        workout: {
          ...defaultCompleteWorkout,
        },
      });
    });
  });
  describe("GET /completeWorkouts/:id", async () => {
    it("fetches a complete workout by ID", async () => {
      const { cookie } = await loginFlow();
      const { user } = await getAuthMeAndReturn(cookie!);
      if (!("id" in user)) return;
      const {
        res,
        completeWorkout: {
          workout: {
            workout: { id: completeWorkoutId },
          },
        },
      } = await createCompleteWorkoutAndReturn(cookie!);
      const { overview, overviewRes } = await getWorkoutOverviewAndReturn(
        cookie!,
        completeWorkoutId
      );
      expect(overviewRes.status).toBe(200);
      expect(overview).toEqual({
        ...defaultCompleteWorkout,
      });
    });
  });

  describe("PUT /completeWorkouts/:id", () => {
    it("updates a complete workout", async () => {
      const { cookie } = await loginFlow();
      const { user } = await getAuthMeAndReturn(cookie!);
      if (!("id" in user)) return;

      const { completeWorkout } = await createCompleteWorkoutAndReturn(cookie!);
      const workoutId = completeWorkout.workout.workout.id;

      const updatedWorkout = structuredClone(completeWorkout.workout);
      updatedWorkout.workout.name = "Updated Workout Name";
      updatedWorkout.exercises[0]!.name = "Squats";
      updatedWorkout.exercises[0]!.sets[0]!.reps = 69;

      const { res } = await updateCompleteWorkoutAndReturn(cookie!, workoutId, {
        workout: updatedWorkout.workout,
        exercises: updatedWorkout.exercises,
      });

      expect(res.status).toBe(200);
      const updatedWorkoutFromDB = getCompleteWorkoutByWorkoutId(
        db,
        workoutId,
        user.id
      );
      expect(updatedWorkoutFromDB.workout.name).toBe("Updated Workout Name");
      expect(updatedWorkoutFromDB.exercises[0]!.name).toBe("Squats");
      expect(updatedWorkoutFromDB.exercises[0]!.sets[0]!.reps).toBe(69);
    });

    it("updates complete workout if user adds more exercises", async () => {
      const { cookie } = await loginFlow();
      const { user } = await getAuthMeAndReturn(cookie!);
      if (!("id" in user)) return;

      const { completeWorkout } = await createCompleteWorkoutAndReturn(cookie!);
      const workoutId = completeWorkout.workout.workout.id;

      const updatedWorkout = structuredClone(completeWorkout.workout);

      // Add a new exercise
      const newExercise = {
        name: "Dumbbell Lunges",
        category: "legs",
        metric: "weight",
        notes: "Focus on form",
        sets: [
          {
            reps: 12,
            metric_value: 185,
          },
          {
            reps: 10,
            metric_value: 205,
          },
        ],
      };

      updatedWorkout.exercises.push(newExercise as any);

      const { res } = await updateCompleteWorkoutAndReturn(cookie!, workoutId, {
        workout: updatedWorkout.workout,
        exercises: updatedWorkout.exercises,
      });

      expect(res.status).toBe(200);
      const updatedWorkoutFromDB = getCompleteWorkoutByWorkoutId(
        db,
        workoutId,
        user.id
      );

      expect(updatedWorkoutFromDB.exercises).toHaveLength(2);
      expect(updatedWorkoutFromDB.exercises[0]!.name).toBe("Bench Press");
      expect(updatedWorkoutFromDB.exercises[1]!.name).toBe("Dumbbell Lunges");
      expect(updatedWorkoutFromDB.exercises[1]!.exercise_id).toEqual(
        expect.any(String)
      );
      expect(updatedWorkoutFromDB.exercises[1]!.category).toBe("legs");
      expect(updatedWorkoutFromDB.exercises[1]!.sets).toHaveLength(2);
      expect(updatedWorkoutFromDB.exercises[1]!.sets[0]!.reps).toBe(12);
      expect(updatedWorkoutFromDB.exercises[1]!.sets[0]!.metric_value).toBe(
        185
      );
    });

    it("deletes sets and exercises when removed from workout", async () => {
      const { cookie } = await loginFlow();
      const { user } = await getAuthMeAndReturn(cookie!);
      if (!("id" in user)) return;

      const workoutData = {
        workout: {
          name: "Upper Body Push Day",
          date: "2025-09-03",
          notes: "Focus on controlled movement and form",
        },
        exercises: [
          {
            name: "Bench Press",
            category: "chest",
            metric: "weight",
            notes: "Keep elbows at 45 degrees",
            sets: [
              {
                reps: 10,
                metric_value: 135,
              },
              {
                reps: 8,
                metric_value: 145,
              },
              {
                reps: 6,
                metric_value: 155,
              },
            ],
          },
          {
            name: "Overhead Press",
            category: "shoulders",
            metric: "weight",
            notes: "Full range of motion",
            sets: [
              {
                reps: 12,
                metric_value: 85,
              },
              {
                reps: 10,
                metric_value: 95,
              },
              {
                reps: 8,
                metric_value: 105,
              },
            ],
          },
        ],
      };

      const { completeWorkout } = await createCompleteWorkoutAndReturn(
        cookie!,
        workoutData
      );
      const workoutId = completeWorkout.workout.workout.id;
      let workoutFromDB = getCompleteWorkoutByWorkoutId(db, workoutId, user.id);
      
      expect(workoutFromDB.exercises).toHaveLength(2);
      expect(workoutFromDB.exercises[0]!.sets).toHaveLength(3);
      expect(workoutFromDB.exercises[1]!.sets).toHaveLength(3);

      const finalUpdate = structuredClone(workoutFromDB);
      finalUpdate.exercises[0]!.sets = [finalUpdate.exercises[0]!.sets[0]!];
      finalUpdate.exercises = [finalUpdate.exercises[0]!];

      const { res } = await updateCompleteWorkoutAndReturn(cookie!, workoutId, {
        workout: finalUpdate.workout,
        exercises: finalUpdate.exercises,
      });
      
      const finalWorkoutFromDB = getCompleteWorkoutByWorkoutId(
        db,
        workoutId,
        user.id
      );
      
      expect(res.status).toBe(200);
      expect(finalWorkoutFromDB.exercises).toHaveLength(1);
      expect(finalWorkoutFromDB.exercises[0]!.name).toBe("Bench Press");
      expect(finalWorkoutFromDB.exercises[0]!.sets).toHaveLength(1);
      expect(finalWorkoutFromDB.exercises[0]!.sets[0]!.reps).toBe(10);
      expect(finalWorkoutFromDB.exercises[0]!.sets[0]!.metric_value).toBe(135);
    });

    it("throws 401 if data doesnt match validators", async () => {
      const { cookie } = await loginFlow();
      const { user } = await getAuthMeAndReturn(cookie!);
      if (!("id" in user)) return;

      const { completeWorkout } = await createCompleteWorkoutAndReturn(cookie!);
      const workoutId = completeWorkout.workout.workout.id;

      const updatedWorkout = structuredClone(completeWorkout.workout);
      updatedWorkout.workout.name = "";
      updatedWorkout.exercises[0]!.name = "";
      updatedWorkout.exercises[0]!.sets[0]!.reps = -69;

      const { res, updateResponse } = await updateCompleteWorkoutAndReturn(
        cookie!,
        workoutId,
        {
          workout: updatedWorkout.workout,
          exercises: updatedWorkout.exercises,
        }
      );

      expect(res.status).toBe(400);
      expect(updateResponse).toEqual({
        errors: [
          "Workout name cannot be empty",
          "Exercise name cannot be empty",
          "Reps must be at least 1",
        ],
      });
    });

    it("returns 401 if no auth token is provided", async () => {
      const { cookie } = await loginFlow();
      const { completeWorkout } = await createCompleteWorkoutAndReturn(cookie!);
      const workoutId = completeWorkout.workout.workout.id;
      const req = updateCompleteWorkoutRequest(workoutId);
      const res = await app.fetch(req);
      expect(res.status).toBe(401);
    });
  });
});
