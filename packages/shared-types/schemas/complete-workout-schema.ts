import { z } from "zod/v4";
import { workoutSchema } from "./workout-schema";
import { exerciseSchema } from "./exercise-schema";

export const completeWorkoutSchema = z.object({
  workout: workoutSchema,
  exercises: z.array(
    z.object({
      ...exerciseSchema.shape,
      metric: z.string().min(1, "Please choose a metric for the exercise"),
      sets: z.array(
        z.object({
          reps: z.number().min(1, "Reps must be at least 1"),
          value: z.number().min(1, "Values must be at least 1"),
          notes: z
            .string()
            .max(500, "Notes cannot exceed 500 characters")
            .optional(),
        })
      ),
    })
  ),
});

export type CompleteWorkoutData = z.infer<typeof completeWorkoutSchema>;
