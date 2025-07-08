import { useQuery } from "@tanstack/react-query";
import { ApiError, GetExercisesOfWorkoutResponse } from "@/types/api";
import { getExercisesOfWorkout } from "../api/exercises/getExercisesOfWorkout";

export const useGetExercisesOfWorkout = (workoutId: string) => {
  return useQuery<GetExercisesOfWorkoutResponse, ApiError>({
    queryKey: ["exercises", workoutId],
    queryFn: () => getExercisesOfWorkout(workoutId),
    retry: 1,
  });
};
