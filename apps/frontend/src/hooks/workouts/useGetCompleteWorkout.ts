import { ApiError, GetCompleteWorkoutResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { getCompleteWorkout } from "../api/completeworkouts/getCompleteWorkout";

export const useGetCompleteWorkout = (workoutId: string) => {
  return useQuery<GetCompleteWorkoutResponse, ApiError>({
    queryKey: ["completeWorkout", workoutId],
    queryFn: () => getCompleteWorkout(workoutId),
    retry: 1,
  });
};
