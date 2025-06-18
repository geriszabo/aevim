export interface Set {
  id: string;
  workout_exercise_id: string;
  reps: number;
  weight: number | null;
  duration: number | null;
  distance: number | null;
  notes: string | null;
  set_order: number;
  created_at: string;
}
