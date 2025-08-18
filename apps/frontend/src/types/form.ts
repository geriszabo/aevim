import { WorkoutData } from "@aevim/shared-types";

export type WorkoutFormValues = {
  workout: WorkoutData;
  exercises: {
    name: string;
    category?: string | null | undefined;
    notes?: string;
    metric: string;
    sets: { reps: number; metric_value: number }[];
  }[];
};