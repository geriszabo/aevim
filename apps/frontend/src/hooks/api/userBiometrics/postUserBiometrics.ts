import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES, UserBiometrics } from "@aevim/shared-types";


export const postUserBiometrics = async (  biometrics: UserBiometrics) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.user.biometrics.base}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...biometrics }),
    }
  );

  if (!response.ok) {
    handleApiError(response);
    throw new Error("Request failed")
  }

  return response.json();
};
