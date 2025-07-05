import env from "@/env";
import { CreateWorkoutData } from "@/schemas/create-workout-schema";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const postWorkout = async ({ date, name, notes }: CreateWorkoutData) => {
  const response = await fetch(`${env.API_BASE_URL}${API_ROUTES.workouts.base}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ date, name, notes }),
  });

  if(!response.ok) {
    handleApiError(response)
  }

  return response
};
