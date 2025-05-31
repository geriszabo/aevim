import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const PASSWORD_LENGTH = 8;

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(PASSWORD_LENGTH, {
    message: `Password must be at least ${PASSWORD_LENGTH} characters long`,
  }),
});

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
