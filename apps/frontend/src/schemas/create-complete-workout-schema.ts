import { z } from "zod/v4";
import {exerciseSchema} from "@aevim/shared-types/schemas/exercise-schema"
import {workoutSchema} from "@aevim/shared-types/schemas/workout-schema"

export const completeWorkoutSchema = z.object({
  workout: workoutSchema,
  exercises: z.array(
    z.object({
      ...exerciseSchema.shape,
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
