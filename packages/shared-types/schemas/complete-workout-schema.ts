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
          metric_value: z.number().min(0, "Values must be larger than 0"),
        })
      ),
    })
  ),
});

export const updateCompleteWorkoutSchema = z.object({
  workout: z.object({
    name: z.string({ message: "No string for name update provided" }),
    date: z.iso.date({ message: "No string for date update provided" }),
    notes: z
      .string({ message: "No string for notes update provided" })
      .optional()
      .nullable(),
  }),
  exercises: z.array(
    z.object({
      name: z.string({ message: "No string for name update provided" }),
      notes: z
        .string({ message: "No string for notes update provided" })
        .optional(),
      category: z
        .string({ message: "No string for category update provided" })
        .optional()
        .nullable(),
      exercise_id: z.string().optional(),
      metric: z.string().min(1, "Please choose a metric for the exercise"),
      sets: z.array(
        z.object({
          metric_value: z.number(),
          id: z.string().optional(),
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
