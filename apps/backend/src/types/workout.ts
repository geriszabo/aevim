import type { Workout } from "@aevim/shared-types";
import type z from "zod/v4";
import type { workoutSchema } from "../db/schemas/workout-schema";

export type WorkoutData = z.infer<typeof workoutSchema>;

export type WorkoutWithoutUserId = Omit<Workout, "user_id">;