import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";
import { WorkoutData } from "@aevim/shared-types/workout-schema";

export const postWorkout = async ({ date, name, notes }: WorkoutData) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.workouts.base}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ date, name, notes }),
    }
  );

  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
