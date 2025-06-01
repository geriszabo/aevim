import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const workoutSchema = z.object({
  name: z.string({ message: "You have to give the workout a name" }),
  notes: z.string().optional(),
  date: z.string({ message: "Please pick a date for the workout" }),
});

export const workoutValidator = zValidator(
  "json",
  workoutSchema,
  (result, c) => {
    if (!result.success) {
      return c.json({
        errors: result.error.issues.map((issue) => issue.message),
      });
    }
  }
);
