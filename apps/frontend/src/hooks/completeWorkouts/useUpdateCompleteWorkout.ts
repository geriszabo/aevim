import { ApiError, UpdateCompleteWorkoutResponse } from "@/types/api";
import { UpdateCompleteWorkoutData } from "@aevim/shared-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putCompleteWorkout } from "../api/completeworkouts/putCompleteWorkout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useUpdateCompleteWorkout = (workoutId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<
    UpdateCompleteWorkoutResponse,
    ApiError,
    UpdateCompleteWorkoutData
  >({
    mutationFn: (editCompleteWorkoutData) =>
      putCompleteWorkout({ workoutId, editCompleteWorkoutData }),
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(`/workouts/${workoutId}`);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({
        queryKey: ["completeWorkout", workoutId],
      });
    },
  });
};
