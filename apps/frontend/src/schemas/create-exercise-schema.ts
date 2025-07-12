import z from "zod/v4";

export const createExerciseSchema = z.object({
  name: z.string({ message: "You have to give the exercise a name" }),
  category: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CreateExerciseData = z.infer<typeof createExerciseSchema>;
