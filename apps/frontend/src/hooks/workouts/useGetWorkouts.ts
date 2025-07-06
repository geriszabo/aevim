import { useQuery } from "@tanstack/react-query";
import { ApiError, GetWorkoutsResponse } from "@/types/api";
import { getWorkouts } from "../api/workouts/getWorkouts";

export const useGetWorkouts = () => {
  return useQuery<GetWorkoutsResponse, ApiError>({
    queryKey: ["workouts"],
    queryFn: getWorkouts,
    retry: 1,
  });
};
