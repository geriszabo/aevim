import env from "@/env";
import { GetWorkoutsResponse } from "@/types/api";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const getWorkouts = async (cookie?: string): Promise<GetWorkoutsResponse> => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.workouts.base}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie && { Cookie: cookie }),
      },
      credentials: "include",
    }
  );

   if (!response.ok) {
    if (cookie) {
      throw new Error(`Failed to fetch workouts`);
    } else {
      handleApiError(response);
    }
  }

  return response.json();
};
