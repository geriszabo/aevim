export interface AddWorkoutRequestProps {
  date?: string;
  name?: string;
  notes?: string;
  userId?: string;
  cookie?: string;
}

export interface AddExerciseRequestProps {
  category?: string;
  name?: string;
  userId?: string;
  cookie?: string;
}

export const signupRequest = (
  email = "test@test.com",
  password = "password123"
) => {
  return new Request("http://localhost:3000/api/v1/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const loginrequest = (
  email = "test@test.com",
  password = "password123"
) => {
  return new Request("http://localhost:3000/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const logoutRequest = () => {
  return new Request("http://localhost:3000/api/v1/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const addWorkoutRequest = ({
  date = "2022.08.25",
  name = "crossfit session",
  notes = "im dead",
  userId = "szabogeri69",
  cookie = "",
}: AddWorkoutRequestProps) => {
  return new Request("http://localhost:3000/api/v1/auth/workouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({
      name,
      notes,
      date,
      user_id: userId,
    }),
  });
};

export const getAllWorkoutsRequest = (cookie: string) => {
  return new Request("http://localhost:3000/api/v1/auth/workouts", {
    method: "GET",
    headers: { Cookie: cookie! },
  });
};

export const getSingleWorkoutRequest = (workoutId: string, cookie: string) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}`,
    {
      method: "GET",
      headers: { Cookie: cookie! },
    }
  );
};

export const updateWorkoutRequest = (
  workoutId: string,
  update: { name?: string; date?: string; notes?: string },
  cookie: string
) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie! },
      body: JSON.stringify(update),
    }
  );
};

export const deleteWorkoutRequest = (workoutId: string, cookie: string) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}`,
    {
      method: "DELETE",
      headers: { Cookie: cookie! },
    }
  );
};

export const addExerciseRequest = ({
  name = "bench pressing",
  category = "chest",
  userId = "szabogeri69",
  cookie = "",
}: AddExerciseRequestProps) => {
  return new Request("http://localhost:3000/api/v1/auth/exercises", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({
      name,
      category,
      user_id: userId,
    }),
  });
};

export const addExerciseToWorkoutRequest = ({
  name = "bench pressing",
  category = "chest",
  cookie = "",
  workoutId = "workout123",
}) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}/exercises`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({ name, category }),
    }
  );
};

export const deleteExerciseRequest = (exerciseId: string, cookie: string) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/exercises/${exerciseId}`,
    {
      method: "DELETE",
      headers: { Cookie: cookie! },
    }
  );
};

export const getAllExercisesRequest = (cookie: string) => {
  return new Request("http://localhost:3000/api/v1/auth/exercises", {
    method: "GET",
    headers: { Cookie: cookie! },
  });
};

export const getExercisesByWorkoutIdRequest = (
  cookie: string,
  workoutId: string
) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}/exercises`,
    {
      method: "GET",
      headers: { Cookie: cookie! },
    }
  );
};

export const deleteExerciseFromWorkoutRequest = (
  cookie: string,
  workoutId: string,
  exerciseId: string
) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}/exercises/${exerciseId}`,
    {
      method: "DELETE",
      headers: { Cookie: cookie! },
    }
  );
};

export const updateExerciseRequest = (
  exerciseId: string,
  update: { name?: string; category?: string },
  cookie: string
) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/exercises/${exerciseId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie! },
      body: JSON.stringify(update),
    }
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
}) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}/exercises/${exerciseId}/sets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({
        reps,
        weight,
        duration,
        distance,
        notes,
      }),
    }
  );
};

export const getAllSetsByExerciseIdRequest = (
  cookie: string,
  workoutId: string,
  exerciseId: string
) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}/exercises/${exerciseId}/sets`,
    {
      method: "GET",
      headers: { Cookie: cookie! },
    }
  );
};

export const getWorkoutOverviewRequest = (
  workoutId: string,
  cookie: string
) => {
  return new Request(
    `http://localhost:3000/api/v1/auth/workouts/${workoutId}/overview`,
    {
      method: "GET",
      headers: { Cookie: cookie },
    }
  );
};
