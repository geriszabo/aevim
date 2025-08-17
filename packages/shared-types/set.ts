export interface Set {
  id: string;
  workout_exercise_id: string;
  reps: number;
  metric_value: number;
  order_index: number;
  created_at: string;
}

export type SetMetrics = "weight" | "duration" | "distance";
