import { ApiError, CreateSetResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateSetData } from "@/schemas/create-set-schema";
import { postSet } from "../api/sets/postSet";

export const useCreateSetToExercise = (
  workoutId: string,
  exerciseId: string
) => {
  const queryClient = useQueryClient();

  return useMutation<CreateSetResponse, ApiError, CreateSetData>({
    mutationFn: (setData: CreateSetData) =>
      postSet({ workoutId, exerciseId, setData }),
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
