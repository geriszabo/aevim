import type { Exercise } from "@aevim/shared-types";
import type z from "zod/v4";
import type { exerciseSchema } from "../db/schemas/exercise-schema";

export type ExerciseData = z.infer<typeof exerciseSchema>;

export type ExerciseWithouthUserId = Omit<Exercise, "user_id">;
