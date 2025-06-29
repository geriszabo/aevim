import env from "@/env";
import { LoginFormData } from "@/schemas/login-schema";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const postLogin = async ({ email, password }: LoginFormData) => {
  return await fetch(`${env.API_BASE_URL}${API_ROUTES.auth.login}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
};
