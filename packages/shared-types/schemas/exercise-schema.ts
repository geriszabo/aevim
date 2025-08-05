import { z } from "zod/v4";

export const exerciseSchema = z.object({
  name: z.string({ message: "You have to give the exercise a name" }),
  category: z.string().nullable().optional(),
  metric: z.string().nullable().optional(),
  notes: z.string().optional(),
});

export type ExerciseData = z.infer<typeof exerciseSchema>;