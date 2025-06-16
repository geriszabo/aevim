import type { WorkoutExercise } from "@aevim/shared-types";
import app from "../index";
import type { ExerciseWithouthUserId } from "../types/exercise";
import type { WorkoutWithoutUserId } from "../types/workout";
import {
  addExerciseToWorkoutRequest,
  addWorkoutRequest,
  deleteExerciseFromWorkoutRequest,
  getExercisesByWorkoutIdRequest,
  loginrequest,
  signupRequest,
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
  workoutId: string
) => {
  const exerciseRes = await app.fetch(
    addExerciseToWorkoutRequest({
      cookie: cookie!,
      workoutId,
    })
  );
  const { exercise } = (await exerciseRes.json()) as {
    exercise: ExerciseWithouthUserId;
  };

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
