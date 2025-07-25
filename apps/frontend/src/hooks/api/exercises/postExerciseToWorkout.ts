import env from "@/env";
import { CreateExerciseData } from "@/schemas/create-exercise-schema";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

interface PostExerciseToWorkoutProps {
  workoutId: string;
  exerciseData: CreateExerciseData;
}

export const postExerciseToWorkout = async ({
  exerciseData,
  workoutId,
}: PostExerciseToWorkoutProps) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.exercises.workout(workoutId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...exerciseData }),
    }
  );

  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
