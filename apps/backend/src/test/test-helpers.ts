import type { ExerciseToWorkout, WorkoutExercise } from "@aevim/shared-types";
import app from "../index";
import type { ExerciseWithouthUserId } from "../types/exercise";
import type { WorkoutWithoutUserId } from "../types/workout";
import {
  addExerciseToWorkoutRequest,
  addWorkoutRequest,
  deleteExerciseFromWorkoutRequest,
  deleteWorkoutRequest,
  getExercisesByWorkoutIdRequest,
  getSingleWorkoutRequest,
  loginrequest,
  signupRequest,
  updateWorkoutRequest,
} from "./test-request-helpers";

export async function loginFlow() {
  await app.fetch(signupRequest());
  const loginRes = await app.fetch(loginrequest());
  const cookie = loginRes.headers.get("Set-Cookie");
  return { loginRes, cookie };
}

export const createWorkoutAndReturn = async (cookie: string) => {
  const workoutRes = await app.fetch(addWorkoutRequest({ cookie }));
  const { workout } = (await workoutRes.json()) as {
    workout: WorkoutWithoutUserId;
  };

  return { workoutRes, workout };
};

export const createExerciseAddToWorkoutAndReturn = async (
  cookie: string,
  workoutId: string,
  { name, category }: { name?: string; category?: string } = {}
) => {
  const exerciseRes = await app.fetch(
    addExerciseToWorkoutRequest({
      cookie: cookie!,
      workoutId,
      category,
      name,
    })
  );
  const exercise = (await exerciseRes.json()) as
    | {
        exercise: {
          exercise: ExerciseWithouthUserId;
          workoutExercise: ExerciseToWorkout;
        };
        message: string;
      }
    | { errors: string[] };

  return { exerciseRes, exercise };
};

export const getAllExercisesOfWorkoutAndReturn = async (
  cookie: string,
  workoutId: string
) => {
  const exercisesRes = await app.fetch(
    getExercisesByWorkoutIdRequest(cookie!, workoutId)
  );
  const { exercises } = (await exercisesRes.json()) as {
    exercises: WorkoutExercise[];
  };

  return { exercisesRes, exercises };
};

export const deleteExerciseFromWorkoutAndReturn = async (
  cookie: string,
  workoutId: string,
  exerciseId: string
) => {
  const deletedExerciseRes = await app.fetch(
    deleteExerciseFromWorkoutRequest(cookie, workoutId, exerciseId)
  );
  const deletedExercise = await deletedExerciseRes.json();
  return { deletedExerciseRes, deletedExercise };
};

export const deleteWorkoutAndReturn = async (
  cookie: string,
  workoutId: string
) => {
  const deleteRes = await app.fetch(deleteWorkoutRequest(workoutId, cookie!));
  const deletedWorkout = await deleteRes.json();

  return { deleteRes, deletedWorkout };
};

export const getSingleWorkoutAndReturn = async (
  cookie: string,
  workoutId: string
) => {
  const workoutRes = await app.fetch(
    getSingleWorkoutRequest(workoutId, cookie)
  );
  const workout = await workoutRes.json();

  return { workoutRes, workout };
};

export const updateWorkoutAndReturn = async (
  cookie: string,
  workoutId: string,
  update: { name?: string; date?: string; notes?: string }
) => {
  const updateWorkoutRes = await app.fetch(
    updateWorkoutRequest(workoutId, update, cookie)
  );
  const updatedWorkout = await updateWorkoutRes.json();

  return { updateWorkoutRes, updatedWorkout };
};
