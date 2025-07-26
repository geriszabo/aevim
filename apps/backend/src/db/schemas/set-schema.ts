import { zValidator } from "@hono/zod-validator";
import { z } from "zod/v4";

export const setSchema = z.object({
  reps: z.number().min(1, "Reps must be at least 1"),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  duration: z.number().min(0, "Duration cannot be negative").optional(),
  distance: z.number().min(0, "Distance cannot be negative").optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const setValidator = zValidator("json", setSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        errors: result.error.issues.map((issue) => issue.message),
      },
      400
    );
  }
});

export const setUpdateSchema = z
  .object({
    reps: z.number().min(1, "Reps must be at least 1").optional(),
    weight: z.number().min(0, "Weight cannot be negative").optional(),
    duration: z.number().min(0, "Duration cannot be negative").optional(),
    distance: z.number().min(0, "Distance cannot be negative").optional(),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const setUpdateValidator = zValidator(
  "json",
  setUpdateSchema,
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
