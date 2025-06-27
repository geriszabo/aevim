import env from "@/env";
import { LoginFormData } from "@/schemas/login-schema";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const postSignup = async ({
  email,
  password,
}: LoginFormData) => {
  return await fetch(`${env.API_BASE_URL}${API_ROUTES.auth.signup}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  
};