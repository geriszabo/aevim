import type { SetMetrics } from "./set";
import exercisesData from "./exercises.json";

export interface Exercise {
  id: string;
  name: string;
  category?: string | null;
  created_at: string;
  user_id: string;
  metric?: SetMetrics | null
  code: string
}

export type StaticExercise = typeof exercisesData[number];
