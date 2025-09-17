import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, UpdateUserBiometricsResponse } from "@/types/api";
import { UserBiometrics } from "@aevim/shared-types";
import { putUserBiometrics } from "../api/userBiometrics/putUserBiometrics";
import { toast } from "sonner";

export const useUpdateUserBiometrics = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserBiometricsResponse, ApiError, UserBiometrics>({
    mutationFn: (userBiometrics) => putUserBiometrics(userBiometrics),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["userBiometrics"] });
    },
  });
};
