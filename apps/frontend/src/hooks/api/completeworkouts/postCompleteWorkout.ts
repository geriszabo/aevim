import { apiClient } from "@/hooks/helpers";
import { CreateCompleteWorkoutResponse } from "@/types/api";
import { API_ROUTES } from "@aevim/shared-types/api-routes";
import { CreateCompleteWorkoutData } from "@aevim/shared-types/schemas";

export const postCompleteWorkout = async ({
  exercises,
  workout,
}: CreateCompleteWorkoutData) => {
  return apiClient<CreateCompleteWorkoutResponse>(
    API_ROUTES.completeWorkouts.base,
    {
      method: "POST",
      body: { exercises, workout },
    },
  );
};
