import { z } from "zod/v4";
import { workoutSchema } from "./workout-schema";
import { exerciseSchema } from "./exercise-schema";
import { zValidator } from "@hono/zod-validator";

const completeWorkoutSchema = z.object({
  workout: workoutSchema,
  exercises: z.array(
    z.object({
      ...exerciseSchema.shape,
      metric: z.string(),
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

export const completeWorkoutValidator = zValidator(
  "json",
  completeWorkoutSchema,
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          errors: result.error.issues.map((issue) => issue.message),
        },
        400
      );
    }
  }
);
