import { workoutSchema } from "@aevim/shared-types";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod/v4";


export const workoutValidator = zValidator(
  "json",
  workoutSchema,
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

const workoutUpdateSchema = z
  .object({
    name: z
      .string({ message: "No string for name update provided" })
      .optional(),
    date: z
      .iso.date({ message: "No string for date update provided" })
      .optional(),
    notes: z
      .string({ message: "No string for notes update provided" })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const workoutUpdateValidator = zValidator(
  "json",
  workoutUpdateSchema,
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
