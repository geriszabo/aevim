import { apiClient } from "@/hooks/helpers";
import { UpdateCompleteWorkoutResponse } from "@/types/api";
import { UpdateCompleteWorkoutData } from "@aevim/shared-types";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

interface PutCompleteWorkoutProps {
  workoutId: string;
  editCompleteWorkoutData: UpdateCompleteWorkoutData;
}

export const putCompleteWorkout = async ({
  workoutId,
  editCompleteWorkoutData,
}: PutCompleteWorkoutProps) => {
  return apiClient<UpdateCompleteWorkoutResponse>(
    API_ROUTES.completeWorkouts.single(workoutId),
    {
      body: editCompleteWorkoutData,
      method: "PUT",
    },
  );
};
