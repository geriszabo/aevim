import { z } from "zod";

export const exerciseSchema = z.object({
  name: z.string({ message: "You have to give the exercise a name" }),
  category: z.string().nullable().optional(),
  metric: z.string().nullable().optional(),
  code: z.string().min(1, "You must provide the exercise code"),
  notes: z.string().optional(),
});

export type ExerciseData = z.infer<typeof exerciseSchema>;
