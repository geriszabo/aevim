import { apiClient } from "@/hooks/helpers";
import { CreateUserBiometricsResponse } from "@/types/api";
import { API_ROUTES, UserBiometrics } from "@aevim/shared-types";

export const postUserBiometrics = async (biometrics: UserBiometrics) => {
  return apiClient<CreateUserBiometricsResponse>(
    API_ROUTES.user.biometrics.base,
    {
      method: "POST",
      body: biometrics,
    },
  );
};
