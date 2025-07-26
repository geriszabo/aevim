import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError, CreateCompleteWorkoutResponse } from "@/types/api";
import { CreateCompleteWorkoutData } from "@/schemas/create-complete-workout-schema";
import { postCompleteWorkout } from "../api/workouts/postCompleteWorkout";

export const useCreateCompleteWorkout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    CreateCompleteWorkoutResponse,
    ApiError,
    CreateCompleteWorkoutData
  >({
    mutationFn: postCompleteWorkout,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(`/workouts/${data.workout.workout.id}`);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};
