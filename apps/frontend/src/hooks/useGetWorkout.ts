import { useQuery } from "@tanstack/react-query";
import { getWorkout } from "./api/workouts/getWorkout";
import { ApiError, GetWorkoutResponse } from "@/types/api";

export const useGetWorkout = (workoutId: string) => {
  return useQuery<GetWorkoutResponse, ApiError>({
    queryKey: ["workout", workoutId],
    queryFn: () => getWorkout(workoutId),
    retry: 1,
  });
};
