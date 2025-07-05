import { useQuery } from "@tanstack/react-query";
import { getWorkout } from "./api/workouts/getWorkout";

export const useGetWorkout = (workoutId: string) => {
  return useQuery({
    queryKey: ["workout", workoutId],
    queryFn: () => getWorkout(workoutId),
    retry: 1,
  });
};
