import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";

import { API_ROUTES } from "@aevim/shared-types";

export const getWorkout = async (workoutId: string) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.workouts.single(workoutId)}`,
    {
      method: "GET",
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
