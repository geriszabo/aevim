import { zValidator } from "@hono/zod-validator";
import { completeWorkoutSchema } from "@aevim/shared-types/schemas";

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
