import { ApiError, GetWorkoutOverviewResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { getWorkoutOverview } from "../api/workouts/getWorkoutOverview";

export const useGetCompleteWorkout = (workoutId: string) => {
  return useQuery<GetWorkoutOverviewResponse, ApiError>({
    queryKey: ["completeWorkout", workoutId],
    queryFn: () => getWorkoutOverview(workoutId),
    retry: 1,
  });
};
