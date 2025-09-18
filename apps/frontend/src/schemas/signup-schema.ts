import * as z from "zod/v4";
import { signupSchema as sharedSignupSchema } from "@aevim/shared-types/schemas/signup-schema";

export const signupSchema = z
  .object({
    ...sharedSignupSchema.shape,
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 8 characters"),
  })
  .check((ctx) => {
    if (
      ctx.value.password &&
      ctx.value.confirmPassword &&
      ctx.value.password !== ctx.value.confirmPassword
    ) {
      ctx.issues.push({
        code: "custom",
        message: "Passwords must match",
        path: ["password"],
        input: ctx.value,
      });
      ctx.issues.push({
        code: "custom",
        message: "Passwords must match",
        path: ["confirmPassword"],
        input: ctx.value,
      });
    }
  });

export type SignupFormData = z.infer<typeof signupSchema>;
