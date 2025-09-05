import { userBiometricsSchema, userBiometricsUpdateSchema } from "@aevim/shared-types/schemas/user-schema";
import { zValidator } from "@hono/zod-validator";

export const userBiometricsValidator = zValidator(
  "json",
  userBiometricsSchema,
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

export const userBiometricsUpdateValidator = zValidator(
  "json",
  userBiometricsUpdateSchema,
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
