import * as z from "zod/v4";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Your name has to be at least 3 characters long"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
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
