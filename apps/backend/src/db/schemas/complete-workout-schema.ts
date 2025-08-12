import { createCompleteWorkoutSchema, updateCompleteWorkoutSchema } from "@aevim/shared-types";
import { zValidator } from "@hono/zod-validator";

export const createCompleteWorkoutValidator = zValidator(
  "json",
  createCompleteWorkoutSchema,
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

export const updateCompleteWorkoutValidator = zValidator(
  "json",
  updateCompleteWorkoutSchema,
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
