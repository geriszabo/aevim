import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
