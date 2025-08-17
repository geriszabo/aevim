import { z } from "zod/v4";
import { workoutSchema } from "./workout-schema";
import { exerciseSchema } from "./exercise-schema";

export const createCompleteWorkoutSchema = z.object({
  workout: workoutSchema,
  exercises: z.array(
    z.object({
      ...exerciseSchema.shape,
      metric: z.string().min(1, "Please choose a metric for the exercise"),
      sets: z.array(
        z.object({
          reps: z.number().min(1, "Reps must be at least 1"),
          metric_value: z.number().min(1, "Values must be at least 1"),
        })
      ),
    })
  ),
});

export const updateCompleteWorkoutSchema = z.object({
  workout: z.object({
    ...workoutSchema.shape,
    id: z.string(),
    created_at: z.string(),
  }),
  exercises: z.array(
    z.object({
      ...exerciseSchema.shape,
      created_at: z.string(),
      exercise_id: z.string(),
      order_index: z.number(),
      metric: z.string().min(1, "Please choose a metric for the exercise"),
      sets: z.array(
        z.object({
          created_at: z.string(),
          metric_value: z.number(),
          order_index: z.number(),
          id: z.string(),
          reps: z.number().min(1, "Reps must be at least 1"),
        })
      ),
    })
  ),
});

export type CreateCompleteWorkoutData = z.infer<
  typeof createCompleteWorkoutSchema
>;
export type UpdateCompleteWorkoutData = z.infer<
  typeof updateCompleteWorkoutSchema
>;
