import env from "@/env";
import { GetUserBiometricsResponse } from "@/types/api";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types";

export const getUserBiometrics = async (
  cookie?: string
): Promise<GetUserBiometricsResponse> => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.user.biometrics.base}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie && { Cookie: cookie }),
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    if (cookie) {
      throw new Error(`Failed to fetch user biometrics`);
    } 
    else {
      handleApiError(response);
    }
  }

  return response.json();
};
