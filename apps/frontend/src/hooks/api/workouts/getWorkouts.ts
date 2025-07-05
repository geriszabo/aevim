import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const getWorkouts = async ()=> {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.workouts.base}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    handleApiError(response)
  }

  return response.json();
};
