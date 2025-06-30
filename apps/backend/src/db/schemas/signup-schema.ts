import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const PASSWORD_LENGTH = 8;
const USERNAME_LENGTH = 3;

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(PASSWORD_LENGTH, {
    message: `Password must be at least ${PASSWORD_LENGTH} characters long`,
  }),
  username: z.string().min(USERNAME_LENGTH, {
    message: `Username must be at least ${USERNAME_LENGTH} characters long`,
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
