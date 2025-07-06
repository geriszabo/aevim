import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWorkout } from "./api/workouts/postWorkout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError, CreateWorkoutResponse } from "@/types/api";
import { CreateWorkoutData } from "@/schemas/create-workout-schema";

export const useCreateWorkout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<CreateWorkoutResponse, ApiError, CreateWorkoutData>({
    mutationFn: postWorkout,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(`/workouts/${data.workout.id}`);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};
