import type {
  ExerciseToWorkout,
  Set,
  WorkoutExercise,
  WorkoutOverview,
  WorkoutWithoutUserId,
} from "@aevim/shared-types";
import app from "../index";
import type { ExerciseWithouthUserId } from "../types/exercise";
import {
  addCompleteWorkoutRequest,
  addExerciseRequest,
  addExerciseToWorkoutRequest,
  addSetRequest,
  addWorkoutRequest,
  authMeRequest,
  deleteExerciseFromWorkoutRequest,
  deleteExerciseRequest,
  deleteSetRequest,
  deleteWorkoutRequest,
  getAllExercisesRequest,
  getAllSetsByExerciseIdRequest,
  getAllWorkoutsRequest,
  getExercisesByWorkoutIdRequest,
  getSingleWorkoutRequest,
  getWorkoutOverviewRequest,
  loginrequest,
  logoutRequest,
  signupRequest,
  updateCompleteWorkoutRequest,
  updateExerciseRequest,
  updateSetRequest,
  updateWorkoutRequest,
} from "./test-request-helpers";

export async function loginFlow() {
  await app.fetch(signupRequest());
  const loginRes = await app.fetch(loginrequest());
  const cookie = loginRes.headers.get("Set-Cookie");
  return { loginRes, cookie };
}

export const getAuthMeAndReturn = async (cookie: string) => {
  const authMeRes = await app.fetch(authMeRequest(cookie));

  let json;
  try {
    json = await authMeRes.json();
  } catch (error) {
    json = { errors: ["Invalid response format"] };
  }

  if (authMeRes.ok) {
    const user = json as { id: string; email: string; username: string };
    return { authMeRes, user, success: true as const };
  } else {
    const user = json as { errors: string[] };
    return { authMeRes, user, success: false as const };
  }
};

export const createWorkoutAndReturn = async (
  cookie: string,
  workoutData: {
    date?: string;
    name?: string;
    notes?: string;
    userId?: string;
  } = {}
) => {
  const workoutRes = await app.fetch(
    addWorkoutRequest({ cookie, ...workoutData })
  );
  const json = await workoutRes.json();

  if (workoutRes.ok) {
    const workout = json as {
      message: string;
      workout: WorkoutWithoutUserId;
    };
    return { workoutRes, workout: workout.workout, success: true as const };
  } else {
    const workout = json as { errors: string[] };
    return { workoutRes, workout, success: false as const };
  }
};

export const createExerciseAddToWorkoutAndReturn = async (
  cookie: string,
  workoutId: string,
  {
    name,
    category,
    notes,
  }: { name?: string; category?: string; notes?: string } = {}
) => {
  const exerciseRes = await app.fetch(
    addExerciseToWorkoutRequest({
      cookie: cookie!,
      workoutId,
      category,
      name,
      notes,
    })
  );
  const json = await exerciseRes.json();

  if (exerciseRes.ok) {
    const exercise = json as {
      message: string;
      exercise: ExerciseWithouthUserId;
      workoutExercise: ExerciseToWorkout;
    };
    return { exerciseRes, exercise, success: true as const };
  } else {
    const exercise = json as { errors: string[] };
    return { exerciseRes, exercise, success: false as const };
  }
};

export const getAllExercisesOfWorkoutAndReturn = async (
  cookie: string,
  workoutId: string
) => {
  const exercisesRes = await app.fetch(
    getExercisesByWorkoutIdRequest(cookie!, workoutId)
  );
  const json = (await exercisesRes.json()) as {
    exercises: WorkoutExercise[];
  };
  if (exercisesRes.ok) {
    const exercises = json.exercises as WorkoutExercise[];
    return { exercisesRes, exercises, success: true as const };
  } else {
    const exercises = json as unknown as { errors: string[] };
    return { exercisesRes, exercises, success: false as const };
  }
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
  const workouts = (await workoutsRes.json()) as {
    workouts: WorkoutWithoutUserId[];
  };
  return { workoutsRes, workouts };
};

export const signupAndReturn = async (
  email?: string,
  password?: string,
  username?: string
) => {
  const signupRes = await app.fetch(signupRequest(email, password, username));
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

export const completeAuthFlow = async (
  email?: string,
  password?: string,
  username?: string
) => {
  await signupAndReturn(email, password, username);
  return await loginAndReturn(email, password);
};

export const createExerciseAndReturn = async (
  cookie: string,
  exerciseData: { name?: string; category?: string } = {}
) => {
  const exerciseRes = await app.fetch(
    addExerciseRequest({ cookie, ...exerciseData })
  );
  const exercise = await exerciseRes.json();

  return { exerciseRes, exercise };
};

export const getAllExercisesAndReturn = async (cookie: string) => {
  const exercisesRes = await app.fetch(getAllExercisesRequest(cookie));
  const { exercises } = (await exercisesRes.json()) as {
    exercises: ExerciseWithouthUserId[];
  };
  return { exercisesRes, exercises };
};

export const deleteExerciseAndReturn = async (
  cookie: string,
  exerciseId: string
) => {
  const deletedExerciseRes = await app.fetch(
    deleteExerciseRequest(exerciseId, cookie)
  );
  const deletedExercise = await deletedExerciseRes.json();
  return { deletedExerciseRes, deletedExercise };
};

export const updateExerciseAndReturn = async (
  cookie: string,
  exerciseId: string,
  updateData: { name?: string; category?: string }
) => {
  const updatedExerciseRes = await app.fetch(
    updateExerciseRequest(exerciseId, updateData, cookie)
  );
  const updatedExercise = await updatedExerciseRes.json();
  return { updatedExerciseRes, updatedExercise };
};

export const createSetAddToWorkoutAndReturn = async (
  cookie: string,
  workoutId: string,
  exerciseId: string,
  setData: {
    reps?: number;
    metric_value?: number;
  } = {}
) => {
  const setRes = await app.fetch(
    addSetRequest({
      cookie,
      workoutId,
      exerciseId,
      ...setData,
    })
  );
  const set = await setRes.json();
  if (setRes.ok) {
    return { setRes, set, success: true as const } as {
      setRes: Response;
      set: {
        message: string;
        set: Set;
      };
      success: true;
    };
  } else {
    return { setRes, set, success: false as const } as {
      setRes: Response;
      set: { errors: string[] };
      success: false;
    };
  }
};

export const getAllSetsByExerciseIdAndReturn = async (
  cookie: string,
  workoutId: string,
  exerciseId: string
) => {
  const setsRes = await app.fetch(
    getAllSetsByExerciseIdRequest(cookie, workoutId, exerciseId)
  );
  const sets = await setsRes.json();
  if (setsRes.ok) {
    return { setsRes, sets, success: true as const } as {
      setsRes: Response;
      sets: { sets: Set[] };
      success: true;
    };
  } else {
    return { setsRes, sets, success: false as const } as {
      setsRes: Response;
      sets: { errors: string[] };
      success: false;
    };
  }
};

export const getWorkoutOverviewAndReturn = async (
  cookie: string,
  workoutId: string
) => {
  const overviewRes = await app.fetch(
    getWorkoutOverviewRequest(workoutId, cookie)
  );
  const json = await overviewRes.json();

  if (overviewRes.ok) {
    const overview = json as { overview: WorkoutOverview };
    return { overviewRes, overview: overview.overview, success: true as const };
  } else {
    const overview = json as { errors: string[] };
    return { overviewRes, overview, success: false as const };
  }
};

export const deleteSetAndReturn = async (
  cookie: string,
  workoutId: string,
  exerciseId: string,
  setId: string
) => {
  const deletedSetRes = await app.fetch(
    deleteSetRequest(workoutId, exerciseId, setId, cookie)
  );
  const deletedSet = await deletedSetRes.json();

  if (deletedSetRes.ok) {
    return { deletedSetRes, deletedSet, success: true as const };
  } else {
    const errorResponse = deletedSet as { errors: string[] };
    return {
      deletedSetRes,
      deletedSet: errorResponse,
      success: false as const,
    };
  }
};

export const updateSetAndReturn = async (
  cookie: string,
  workoutId: string,
  exerciseId: string,
  setId: string,
  update: {
    reps?: number;
    metric_value?: number;
  }
) => {
  const updatedSetRes = await app.fetch(
    updateSetRequest(workoutId, exerciseId, setId, update, cookie)
  );
  const updatedSet = await updatedSetRes.json();

  if (updatedSetRes.ok) {
    return { updatedSetRes, updatedSet, success: true as const } as {
      updatedSetRes: Response;
      updatedSet: { message: string; set: Set };
      success: true;
    };
  } else {
    return { updatedSetRes, updatedSet, success: false as const } as {
      updatedSetRes: Response;
      updatedSet: { errors: string[] };
      success: false;
    };
  }
};

export const createCompleteWorkoutAndReturn = async (
  cookie: string,
  completeWorkoutData: {
    workout?: {
      name?: string;
      date?: string;
      notes?: string;
    };
    exercises?: Array<{
      name?: string;
      category?: string;
      metric?: string;
      notes?: string;
      sets?: Array<{
        reps?: number;
        metric_value?: number;
      }>;
    }>;
  } = {}
) => {
  const { exercises, workout } = completeWorkoutData;
  const res = await app.fetch(
    addCompleteWorkoutRequest(cookie, workout, exercises)
  );
  const completeWorkout = (await res.json()) as {
    message: string;
    workout: WorkoutOverview;
  };
  return { res, completeWorkout };
};

export const updateCompleteWorkoutAndReturn = async (
  cookie: string,
  workoutId: string,
  updateData: WorkoutOverview
) => {
  const { exercises, workout } = updateData;
  const res = await app.fetch(
    updateCompleteWorkoutRequest(workoutId, cookie, workout, exercises)
  );
  const updateResponse = await res.json();
  return { res, updateResponse };
};
