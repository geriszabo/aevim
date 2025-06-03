export interface AddWorkoutRequestProps {
  date?: string;
  name?: string;
  notes?: string;
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
