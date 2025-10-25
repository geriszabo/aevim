import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types";

export const deleteWorkout = async (workoutId: string) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.completeWorkouts.single(workoutId)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    handleApiError(response);
  }
  return response.json();
};
