import env from "@/env";
import { handleApiError } from "@/lib/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";
import type { LoginSchema } from "@aevim/shared-types/schemas";

export const postLogin = async ({ email, password }: LoginSchema) => {
  const response = await fetch(`${env.API_BASE_URL}${API_ROUTES.auth.login}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
