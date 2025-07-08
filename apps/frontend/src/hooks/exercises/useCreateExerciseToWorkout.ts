import { CreateExerciseData } from "@/schemas/create-exercise-schema";
import { ApiError, CreateExerciseResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postExerciseToWorkout } from "../api/exercises/postExerciseToWorkout";
import { toast } from "sonner";

export const useCreateExerciseToWorkout = (workoutId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CreateExerciseResponse, ApiError, CreateExerciseData>({
    mutationFn: (exerciseData: CreateExerciseData) =>
      postExerciseToWorkout({ workoutId, exerciseData }),
    onSuccess: (data) => {
      toast.success(data.message || "Exercise added successfully!");

      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
      queryClient.invalidateQueries({
        queryKey: ["workout", workoutId, "exercises"],
      });
      queryClient.invalidateQueries({ queryKey: ["exercises", workoutId] });
    },
  });
};
