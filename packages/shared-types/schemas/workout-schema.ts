import { z } from "zod/v4";

export const workoutSchema = z.object({
  name: z.string().min(1, { message: "You have to give the workout a name" }),
  notes: z.string().nullable().optional(),
  date: z.iso.date({ message: "Please pick a date for the workout in YYYY-MM-DD format" }),
});

export type WorkoutData = z.infer<typeof workoutSchema>;
