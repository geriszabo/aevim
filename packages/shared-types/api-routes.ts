export const API_ROUTES = {
  auth: {
    signup: "/signup",
    login: "/login",
    logout: "/logout",
    me: "/auth/me",
  },
  workouts: {
    base: "/auth/workouts",
    createComplete: "/auth/workouts/create",
    single: (id: string) => `/auth/workouts/${id}`,
    overview: (id: string) => `/auth/workouts/${id}/overview`,
  },
  exercises: {
    base: "/auth/exercises",
    single: (id: string) => `/auth/exercises/${id}`,
    workout: (workoutId: string) => `/auth/workouts/${workoutId}/exercises`,
    workoutSingle: (workoutId: string, exerciseId: string) =>
      `/auth/workouts/${workoutId}/exercises/${exerciseId}`,
  },
  sets: {
    base: (workoutId: string, exerciseId: string) =>
      `/auth/workouts/${workoutId}/exercises/${exerciseId}/sets`,
    single: (workoutId: string, exerciseId: string, setId: string) =>
      `/auth/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;