export interface Set {
  id: string;
  workout_exercise_id: string;
  reps: number;
  weight: number | null;
  duration: number | null;
  distance: number | null;
  notes: string | null;
  order_index: number;
  created_at: string;
}
