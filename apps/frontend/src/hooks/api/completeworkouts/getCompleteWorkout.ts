import { apiClient } from "@/hooks/helpers";
import { GetCompleteWorkoutResponse } from "@/types/api";
import { API_ROUTES } from "@aevim/shared-types";

export const getCompleteWorkout = async (
  workoutId: string,
  cookie?: string,
): Promise<GetCompleteWorkoutResponse> => {
  return apiClient<GetCompleteWorkoutResponse>(
    API_ROUTES.completeWorkouts.single(workoutId),
    { cookie },
  );
};
