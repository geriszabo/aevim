import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ApiError,
  CreateUserBiometricsResponse,
} from "@/types/api";
import { UserBiometrics } from "@aevim/shared-types/schemas";
import { postUserBiometrics } from "../api/userBiometrics/postUserBiometrics";

export const useCreateUserBiometrics = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateUserBiometricsResponse, ApiError, UserBiometrics>({
    mutationFn: postUserBiometrics,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["userBiometrics"] });
    },
  });
};
