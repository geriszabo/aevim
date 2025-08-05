import { zValidator } from "@hono/zod-validator";
import { signupSchema } from "@aevim/shared-types/schemas/signup-schema";

export const signupValidator = zValidator("json", signupSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        errors: result.error.issues.map((issue) => issue.message),
      },
      400
    );
  }
});
