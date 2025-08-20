import type { SetMetrics } from "./set";

export interface Workout {
  id: string;
  name: string;
  notes?: string | null;
  date: string;
  created_at: string;
  user_id: string;
}

export type WorkoutWithoutUserId = Omit<Workout, "user_id">;

export type WorkoutOverview = {
  workout: WorkoutWithoutUserId;
  exercises: Array<{
    id: string;
    workout_id: string;
    exercise_id: string;
    order_index: number;
    name: string;
    category: string;
    metric: SetMetrics
    created_at: string;
    sets: Array<{
      id: string;
      workout_exercise_id: string;
      reps: number;
      metric_value: number;
      order_index: number;
      created_at: string;
    }>;
  }>;
};
