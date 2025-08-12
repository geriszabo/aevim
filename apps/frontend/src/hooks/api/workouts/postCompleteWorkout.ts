import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";
import { CreateCompleteWorkoutData } from "@aevim/shared-types/schemas";

export const postCompleteWorkout = async ({exercises, workout}: CreateCompleteWorkoutData) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.workouts.createComplete}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ exercises, workout }),
    }
  );

  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
