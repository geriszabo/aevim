import type {
  WorkoutWithoutUserId,
  WorkoutOverview,
  Exercise,
  ExerciseToWorkout,
  WorkoutExercise,
} from "@aevim/shared-types";

export interface ApiErrorResponse {
  errors: string[];
}

export interface ApiError {
  message: string;
  status: number;
  errors: string[];
}

export interface GetWorkoutsResponse {
  workouts: WorkoutWithoutUserId[];
}

export interface GetWorkoutResponse {
  workout: WorkoutWithoutUserId;
}

export interface CreateWorkoutResponse {
  message: string;
  workout: WorkoutWithoutUserId;
}

export interface GetWorkoutOverviewResponse {
  overview: WorkoutOverview;
}

export interface DeleteWorkoutResponse {
  message: string;
}

export interface UpdateWorkoutResponse {
  message: string;
  workout: WorkoutWithoutUserId;
}

export interface CreateExerciseResponse {
  message: string;
  exercise: Omit<Exercise, "user_id">;
  workoutExercise: ExerciseToWorkout;
}
export interface GetExercisesOfWorkoutResponse {
  exercises: Omit<WorkoutExercise, "user_id">[];
}

export interface DeleteExerciseOfWorkoutResponse {
  message: string;
}
