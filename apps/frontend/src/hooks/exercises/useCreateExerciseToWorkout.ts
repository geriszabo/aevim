
import { ApiError, CreateExerciseResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postExerciseToWorkout } from "../api/exercises/postExerciseToWorkout";
import { toast } from "sonner";
import { ExerciseData } from "@aevim/shared-types/schemas/exercise-schema";

export const useCreateExerciseToWorkout = (workoutId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CreateExerciseResponse, ApiError, ExerciseData>({
    mutationFn: (exerciseData: ExerciseData) =>
      postExerciseToWorkout({ workoutId, exerciseData }),
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
      queryClient.invalidateQueries({
        queryKey: ["workout", workoutId, "exercises"],
      });
      queryClient.invalidateQueries({ queryKey: ["exercises", workoutId] });
    },
  });
};
