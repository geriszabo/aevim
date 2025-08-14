import { ApiError, UpdateCompleteWorkoutResponse } from "@/types/api";
import { UpdateCompleteWorkoutData } from "@aevim/shared-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putCompleteWorkout } from "../api/completeworkouts/putCompleteWorkout";
import { toast } from "sonner";

export const useUpdateCompleteWorkout = (workoutId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateCompleteWorkoutResponse,
    ApiError,
    UpdateCompleteWorkoutData
  >({
    mutationFn: (editCompleteWorkoutData) =>
      putCompleteWorkout({ workoutId, editCompleteWorkoutData }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
    },
  });
};
