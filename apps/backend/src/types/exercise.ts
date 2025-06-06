import type { Exercise } from "@aevim/shared-types";
import type { exerciseSchema } from "../db/schemas/exercise-shema";
import type z from "zod";

export type ExerciseData = z.infer<typeof exerciseSchema>;

export type ExerciseWithouthUserId = Omit<Exercise, "user_id">;
