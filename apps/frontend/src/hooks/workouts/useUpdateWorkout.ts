import { ApiError, UpdateWorkoutResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditWorkoutData } from "@/schemas/edit-workout-schema";
import { putWorkout } from "../api/workouts/putWorkout";

export const useUpdateWorkout = (workoutId: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateWorkoutResponse, ApiError, EditWorkoutData>({
    mutationFn: (editWorkoutData) => putWorkout({ workoutId, editWorkoutData }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
    },
  });
};
