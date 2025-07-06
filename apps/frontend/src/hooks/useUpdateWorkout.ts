import { ApiError, UpdateWorkoutResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putWorkout } from "./api/workouts/putWorkout";
import { toast } from "sonner";
import { EditWorkoutData } from "@/schemas/edit-workout-schema";

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
