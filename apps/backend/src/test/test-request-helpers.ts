import { API_ROUTES } from "@aevim/shared-types/api-routes";
import env from "../env";
import type { SetData } from "../types/set";

interface RequestOptions {
  method?: RequestInit["method"];
  body?: Record<string, any>;
  cookie?: string;
  headers?: Record<string, string>;
}

const createRequest = (
  route: string,
  options: RequestOptions = {}
): Request => {
  const { method = "GET", body, cookie, headers = {} } = options;
  const requestHeaders: Record<string, string> = {
    ...headers,
  };
  if (body) {
    requestHeaders["Content-Type"] = "application/json";
  }
  if (cookie) {
    requestHeaders["Cookie"] = cookie;
  }
  return new Request(env.API_BASE_URL + route, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const authMeRequest = (cookie: string): Request => {
  return createAuthenticatedRequest(API_ROUTES.auth.me, cookie);
};

export const createAuthenticatedRequest = (
  route: string,
  cookie: string,
  options: Omit<RequestOptions, "cookie"> = {}
): Request => {
  return createRequest(route, { ...options, cookie });
};

export const signupRequest = (
  email = "test@test.com",
  password = "password123",
  username = "testuser69"
): Request => {
  return new Request(env.API_BASE_URL + API_ROUTES.auth.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      username
    }),
  });
};

export const loginrequest = (
  email = "test@test.com",
  password = "password123",
  username = "testuser69"
): Request => {
  return new Request(env.API_BASE_URL + API_ROUTES.auth.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      username
    }),
  });
};

export const logoutRequest = (): Request => {
  return new Request(env.API_BASE_URL + API_ROUTES.auth.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const addWorkoutRequest = ({
  date = "2022-08-25",
  name = "crossfit session",
  notes = "im dead",
  userId = "szabogeri69",
  cookie = "",
}): Request => {
  return createAuthenticatedRequest(API_ROUTES.workouts.base, cookie, {
    method: "POST",
    body: { name, notes, date, user_id: userId },
  });
};

export const getAllWorkoutsRequest = (cookie: string): Request => {
  return createAuthenticatedRequest(API_ROUTES.workouts.base, cookie);
};

export const getSingleWorkoutRequest = (
  workoutId: string,
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.workouts.single(workoutId),
    cookie
  );
};

export const updateWorkoutRequest = (
  workoutId: string,
  update: { name?: string; date?: string; notes?: string },
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.workouts.single(workoutId),
    cookie,
    { method: "PUT", body: update }
  );
};

export const deleteWorkoutRequest = (
  workoutId: string,
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.workouts.single(workoutId),
    cookie,
    { method: "DELETE" }
  );
};

export const getWorkoutOverviewRequest = (
  workoutId: string,
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.workouts.overview(workoutId),
    cookie
  );
};

export const addExerciseRequest = ({
  name = "bench pressing",
  category = "chest",
  userId = "szabogeri69",
  cookie = "",
}): Request => {
  return createAuthenticatedRequest(API_ROUTES.exercises.base, cookie, {
    method: "POST",
    body: { name, category, user_id: userId },
  });
};

export const addExerciseToWorkoutRequest = ({
  name = "bench pressing",
  category = "chest",
  cookie = "",
  workoutId = "workout123",
  notes = "test note"
}): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.exercises.workout(workoutId),
    cookie,
    {
      method: "POST",
      body: { name, category, notes },
    }
  );
};

export const deleteExerciseRequest = (
  exerciseId: string,
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.exercises.single(exerciseId),
    cookie,
    { method: "DELETE" }
  );
};

export const getAllExercisesRequest = (cookie: string): Request => {
  return createAuthenticatedRequest(API_ROUTES.exercises.base, cookie);
};

export const getExercisesByWorkoutIdRequest = (
  cookie: string,
  workoutId: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.exercises.workout(workoutId),
    cookie
  );
};

export const deleteExerciseFromWorkoutRequest = (
  cookie: string,
  workoutId: string,
  exerciseId: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.exercises.workoutSingle(workoutId, exerciseId),
    cookie,
    { method: "DELETE" }
  );
};

export const updateExerciseRequest = (
  exerciseId: string,
  update: { name?: string; category?: string },
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.exercises.single(exerciseId),
    cookie,
    { method: "PUT", body: update }
  );
};

export const addSetRequest = ({
  workoutId = "defaultWorkoutId",
  exerciseId = "defaultExerciseId",
  reps = 10,
  weight = 100,
  duration = 2,
  distance = 10,
  notes = "felt pretty good",
  cookie = "",
}): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.sets.base(workoutId, exerciseId),
    cookie,
    {
      method: "POST",
      body: { reps, weight, duration, distance, notes },
    }
  );
};

export const getAllSetsByExerciseIdRequest = (
  cookie: string,
  workoutId: string,
  exerciseId: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.sets.base(workoutId, exerciseId),
    cookie
  );
};

export const deleteSetRequest = (
  workoutId: string,
  exerciseId: string,
  setId: string,
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.sets.single(workoutId, exerciseId, setId),
    cookie,
    { method: "DELETE" }
  );
};

export const updateSetRequest = (
  workoutId: string,
  exerciseId: string,
  setId: string,
  update: Partial<SetData>,
  cookie: string
): Request => {
  return createAuthenticatedRequest(
    API_ROUTES.sets.single(workoutId, exerciseId, setId),
    cookie,
    { method: "PUT", body: update }
  );
};
