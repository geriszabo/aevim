import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const setSchema = z.object({
  reps: z.number().min(1, "Reps must be at least 1"),
  metric_value: z.number().nullable(),
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
    metric_value: z.number().nullable(),
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
