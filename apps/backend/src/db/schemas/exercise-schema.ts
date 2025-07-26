import { zValidator } from "@hono/zod-validator";
import { z } from "zod/v4";

export const exerciseSchema = z.object({
  name: z.string({ message: "You have to give the exercise a name" }),
  category: z.string().nullable().optional(),
  notes: z.string().optional(),
});

export const exerciseValidator = zValidator(
  "json",
  exerciseSchema,
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

const exerciseUpdateSchema = z
  .object({
    name: z
      .string({ message: "No string for name update provided" })
      .optional(),
    notes: z
      .string({ message: "No string for notes update provided" })
      .optional(),
    category: z
      .string({ message: "No string for category update provided" })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const exerciseUpdateValidator = zValidator(
  "json",
  exerciseUpdateSchema,
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

export type ExerciseData = z.infer<typeof exerciseSchema>;
