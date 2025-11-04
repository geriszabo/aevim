import { z } from "zod";

export const workoutSchema = z.object({
  name: z
    .string({ message: "You have to give the workout a name" })
    .min(1, { message: "Workout name cant be an empty string" }),
  notes: z.string().nullable().optional(),
  date: z.iso.date({
    message: "Please pick a date for the workout in YYYY-MM-DD format",
  }),
});

export type WorkoutData = z.infer<typeof workoutSchema>;
