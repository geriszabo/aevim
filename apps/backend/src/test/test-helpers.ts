import type { ExerciseToWorkout, WorkoutExercise } from "@aevim/shared-types";
import app from "../index";
import type { ExerciseWithouthUserId } from "../types/exercise";
import type { WorkoutWithoutUserId } from "../types/workout";
import {
  addExerciseToWorkoutRequest,
  addWorkoutRequest,
  deleteExerciseFromWorkoutRequest,
  deleteWorkoutRequest,
  getAllWorkoutsRequest,
  getExercisesByWorkoutIdRequest,
  getSingleWorkoutRequest,
  loginrequest,
  logoutRequest,
  signupRequest,
  updateWorkoutRequest,
} from "./test-request-helpers";

export async function loginFlow() {
  await app.fetch(signupRequest());
  const loginRes = await app.fetch(loginrequest());
  const cookie = loginRes.headers.get("Set-Cookie");
  return { loginRes, cookie };
}

export const createWorkoutAndReturn = async (
  cookie: string,
  workoutData: { date?: string; name?: string; notes?: string; userId?: string } = {}
) => {
  const workoutRes = await app.fetch(addWorkoutRequest({ cookie, ...workoutData }));
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

export const getAllWorkoutsAndReturn = async (cookie: string) => {
  const workoutsRes = await app.fetch(getAllWorkoutsRequest(cookie));
  const workouts = await workoutsRes.json() as { workouts: WorkoutWithoutUserId[] };
  return { workoutsRes, workouts };
};

export const signupAndReturn = async (email?: string, password?: string) => {
  const signupRes = await app.fetch(signupRequest(email, password));
  const json = await signupRes.json();
  return { signupRes, json };
};

export const loginAndReturn = async (email?: string, password?: string) => {
  const loginRes = await app.fetch(loginrequest(email, password));
  const json = await loginRes.json();
  const cookie = loginRes.headers.get("Set-Cookie");
  return { loginRes, json, cookie };
};

export const logoutAndReturn = async () => {
  const logoutRes = await app.fetch(logoutRequest());
  const cookie = logoutRes.headers.get("Set-Cookie");
  return { logoutRes, cookie };
};

export const completeAuthFlow = async (email?: string, password?: string) => {
  await signupAndReturn(email, password);
  return await loginAndReturn(email, password);
};