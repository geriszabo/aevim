import type {
  WorkoutWithoutUserId,
  WorkoutOverview,
  Exercise,
  ExerciseToWorkout,
  WorkoutExercise,
  Set,
} from "@aevim/shared-types";

export interface ApiErrorResponse {
  errors: string[];
}

export interface ApiError {
  message: string;
  status: number;
  errors: string[];
}

interface ApiResponse {
  message: string;
}

export type DeleteWorkoutResponse = ApiResponse;
export type DeleteExerciseOfWorkoutResponse = ApiResponse;

export interface GetWorkoutsResponse {
  workouts: WorkoutWithoutUserId[];
}

export interface GetWorkoutResponse {
  workout: WorkoutWithoutUserId;
}

export interface CreateWorkoutResponse extends ApiResponse {
  workout: WorkoutWithoutUserId;
}

export interface CreateCompleteWorkoutResponse extends ApiResponse {
  workout: WorkoutOverview
}

export interface GetWorkoutOverviewResponse {
  overview: WorkoutOverview;
}

export interface UpdateWorkoutResponse extends ApiResponse {
  workout: WorkoutWithoutUserId;
}

export interface CreateExerciseResponse extends ApiResponse {
  exercise: Omit<Exercise, "user_id">;
  workoutExercise: ExerciseToWorkout;
}

export interface GetExercisesOfWorkoutResponse {
  exercises: Omit<WorkoutExercise, "user_id">[];
}

export interface CreateSetResponse extends ApiResponse {
  set: Set;
}
