import type { Workout } from "@aevim/shared-types";

export interface WorkoutData {
  name: string;
  notes?: string;
  date: string;
}

export type WorkoutWithoutUserId = Omit<Workout, "user_id">