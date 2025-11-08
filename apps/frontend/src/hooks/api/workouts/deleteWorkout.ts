import { apiClient } from "@/hooks/helpers";
import { DeleteWorkoutResponse } from "@/types/api";
import { API_ROUTES } from "@aevim/shared-types";

export const deleteWorkout = async (workoutId: string) => {
  return apiClient<DeleteWorkoutResponse>(
    API_ROUTES.completeWorkouts.single(workoutId),
    {
      method: "DELETE",
    },
  );
};
