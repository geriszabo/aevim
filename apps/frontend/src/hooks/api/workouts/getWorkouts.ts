import { apiClient } from "@/hooks/helpers";
import { GetWorkoutsResponse } from "@/types/api";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const getWorkouts = async (
  cookie?: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  },
): Promise<GetWorkoutsResponse> => {
  return apiClient<GetWorkoutsResponse>(API_ROUTES.workouts.base, {
    cookie,
    queryParams: options,
  });
};
