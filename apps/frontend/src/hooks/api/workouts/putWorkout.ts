import env from "@/env";
import { EditWorkoutData } from "@/schemas/edit-workout-schema";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export interface PutWorkoutProps {
  workoutId: string;
  editWorkoutData: EditWorkoutData;
}

export const putWorkout = async ({
  editWorkoutData,
  workoutId,
}: PutWorkoutProps) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.workouts.single(workoutId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...editWorkoutData }),
    }
  );

  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
