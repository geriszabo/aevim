import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWorkout } from "./api/workouts/postWorkout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/utils/handleApiError";

export const useCreateWorkout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postWorkout,
    onSuccess: async (response) => {
      const { message, workout } = await response.json();
      toast.success(message);
      router.push(`/workouts/${workout.id}`);
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
    onError: (error) => handleApiError(error),
  });
};
