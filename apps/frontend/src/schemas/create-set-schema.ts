import { z } from "zod";

export const createSetSchema = z.object({
  reps: z.number().min(1, "Reps must be at least 1"),
  weight: z.number().min(0, "Weight cannot be negative").optional().nullable(),
  duration: z
    .number()
    .min(0, "Duration cannot be negative")
    .optional()
    .nullable(),
  distance: z
    .number()
    .min(0, "Distance cannot be negative")
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .nullable(),
});

export type CreateSetData = z.infer<typeof createSetSchema>;
