import { z } from "zod";

const PASSWORD_LENGTH = 8;
const USERNAME_LENGTH = 3;

export const signupSchema = z.object({
  email: z.email({message: "Invalid email"}),
  password: z.string().min(PASSWORD_LENGTH, {
    message: `Password must be at least ${PASSWORD_LENGTH} characters long`,
  }),
  username: z.string().min(USERNAME_LENGTH, {
    message: `Username must be at least ${USERNAME_LENGTH} characters long`,
  }),
});
