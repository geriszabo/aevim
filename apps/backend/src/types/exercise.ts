import type { Exercise } from "@aevim/shared-types";

export interface ExerciseData {
  name: string;
  category?: string;
}

export type ExerciseWithouthUserId = Omit<Exercise, "user_id">;
