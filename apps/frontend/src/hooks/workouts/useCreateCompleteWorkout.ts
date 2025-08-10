import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError, CreateCompleteWorkoutResponse } from "@/types/api";
import { postCompleteWorkout } from "../api/workouts/postCompleteWorkout";
import { CompleteWorkoutData } from "@aevim/shared-types/schemas";

export const useCreateCompleteWorkout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    CreateCompleteWorkoutResponse,
    ApiError,
    CompleteWorkoutData
  >({
    mutationFn: postCompleteWorkout,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(`/workouts/${data.workout.workout.id}`);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};
