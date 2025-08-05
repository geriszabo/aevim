import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "@aevim/shared-types/schemas/login-schema";

export const loginValidator = zValidator("json", loginSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        errors: result.error.issues.map((issue) => issue.message),
      },
      400
    );
  }
});
