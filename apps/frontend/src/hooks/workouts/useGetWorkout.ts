import { useQuery } from "@tanstack/react-query";
import { ApiError, GetWorkoutResponse } from "@/types/api";
import { getWorkout } from "../api/workouts/getWorkout";

export const useGetWorkout = (workoutId: string) => {
  return useQuery<GetWorkoutResponse, ApiError>({
    queryKey: ["workout", workoutId],
    queryFn: () => getWorkout(workoutId),
    retry: 1,
  });
};
