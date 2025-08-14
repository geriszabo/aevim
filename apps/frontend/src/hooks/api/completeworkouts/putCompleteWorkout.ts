import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";
import { UpdateCompleteWorkoutData } from "@aevim/shared-types";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

interface PutCompleteWorkoutProps {
  workoutId: string;
  editCompleteWorkoutData: UpdateCompleteWorkoutData;
}

export const putCompleteWorkout = async ({
  workoutId,
  editCompleteWorkoutData,
}: PutCompleteWorkoutProps) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.workouts.single(workoutId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...editCompleteWorkoutData }),
    }
  );
  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
