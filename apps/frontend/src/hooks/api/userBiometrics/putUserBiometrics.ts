import { apiClient } from "@/hooks/helpers";
import { UpdateUserBiometricsResponse } from "@/types/api";
import { API_ROUTES, UserBiometrics } from "@aevim/shared-types";

export const putUserBiometrics = async (biometrics: UserBiometrics) => {
  return apiClient<UpdateUserBiometricsResponse>(
    API_ROUTES.user.biometrics.base,
    {
      method: "PUT",
      body: biometrics,
    },
  );
};
