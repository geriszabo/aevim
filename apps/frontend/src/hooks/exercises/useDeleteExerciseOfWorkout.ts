import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExerciseOfWorkout } from "../api/exercises/deleteExerciseOfWorkout";
import { ApiError, DeleteExerciseOfWorkoutResponse } from "@/types/api";
import { toast } from "sonner";

export const useDeleteExerciseOfWorkout = (
  workoutId: string,
  exerciseId: string
) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteExerciseOfWorkoutResponse, ApiError>({
    mutationFn: () => deleteExerciseOfWorkout(workoutId, exerciseId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["exercises", "workout", workoutId],
      });
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
      queryClient.invalidateQueries({ queryKey: ["exercises", workoutId] });
      queryClient.removeQueries({
        queryKey: ["exercise", exerciseId],
      });
    },
  });
};
