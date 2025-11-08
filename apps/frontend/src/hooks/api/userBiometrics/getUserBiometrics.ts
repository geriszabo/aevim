import { apiClient } from "@/hooks/helpers";
import { GetUserBiometricsResponse } from "@/types/api";
import { API_ROUTES } from "@aevim/shared-types";

export const getUserBiometrics = async (
  cookie?: string,
): Promise<GetUserBiometricsResponse> => {
  return apiClient(API_ROUTES.user.biometrics.base, {
    cookie,
  });
};
