export interface ExerciseToWorkout {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  created_at: string;
  notes?: string | null
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  notes: string | null;
  created_at: string;
  name: string;
  category: string;
}
