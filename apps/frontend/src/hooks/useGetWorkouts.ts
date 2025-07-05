import { useQuery } from "@tanstack/react-query";
import { getWorkouts } from "./api/workouts/getWorkouts";
import { ApiError, GetWorkoutsResponse } from "@/types/api";

export const useGetWorkouts = () => {
  return useQuery<GetWorkoutsResponse, ApiError>({
    queryKey: ["workouts"],
    queryFn: getWorkouts,
    retry: 1,
  });
};
