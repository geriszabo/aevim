import type { Exercise } from "@aevim/shared-types";


export type ExerciseWithouthUserId = Omit<Exercise, "user_id">;
