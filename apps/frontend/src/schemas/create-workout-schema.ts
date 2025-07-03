import { z } from "zod/v4";

export const createWorkoutSchema = z.object({
  name: z.string().min(1, "You have to give the workout a name"),
  notes: z.string().nullable().optional(),
  date: z.iso.date("Please pick a date for the workout in YYYY-MM-DD format"),
});

export type CreateWorkoutData = z.infer<typeof createWorkoutSchema>;
