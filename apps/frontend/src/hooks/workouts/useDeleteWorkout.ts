import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, DeleteWorkoutResponse } from "@/types/api";
import { deleteWorkout } from "../api/workouts/deleteWorkout";
import { toast } from "sonner";

export const useDeleteWorkout = (workoutId: string) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteWorkoutResponse, ApiError>({
    mutationFn: () => deleteWorkout(workoutId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.removeQueries({ queryKey: ["workout", workoutId] });
    },
  });
};
