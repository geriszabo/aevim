import { z } from "zod/v4";

export const editWorkoutSchema = z.object({
  name: z.string({ message: "No string for name update provided" }).optional(),
  date: z.iso
    .date({ message: "No string for date update provided" })
    .optional(),
  notes: z
    .string({ message: "No string for notes update provided" })
    .nullable()
    .optional(),
});

export type EditWorkoutData = z.infer<typeof editWorkoutSchema>;
