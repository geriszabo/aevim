import env from "@/env";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types";

export const getUserBiometrics = async () => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.user.biometrics.base}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
