import { z } from "zod/v4";
import { createWorkoutSchema } from "./create-workout-schema";
import { createExerciseSchema } from "./create-exercise-schema";

export const completeWorkoutSchema = z.object({
  workout: createWorkoutSchema,
  exercises: z.array(
    z.object({
      ...createExerciseSchema.shape,
      metric: z.string(),
      sets: z.array(
        z.object({
          reps: z.number(),
          value: z.number(),
          notes: z
            .string()
            .max(500, "Notes cannot exceed 500 characters")
            .optional(),
        })
      ),
    })
  ),
});

export type CreateCompleteWorkoutData = z.infer<typeof completeWorkoutSchema>;
