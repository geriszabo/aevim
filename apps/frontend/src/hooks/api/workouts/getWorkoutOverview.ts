import env from "@/env";
import { GetWorkoutOverviewResponse } from "@/types/api";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types";

export const getWorkoutOverview = async (
  workoutId: string,
  cookie?: string
): Promise<GetWorkoutOverviewResponse> => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.completeWorkouts.single(workoutId)}`,
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
      throw new Error(`Failed to fetch workout: ${response.status}`);
    } else {
      handleApiError(response);
    }
  }

  return response.json();
};
