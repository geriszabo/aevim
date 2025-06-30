import env from "@/env";
import { SignupFormData } from "@/schemas/signup-schema";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const postSignup = async ({ email, password, username }: Omit<SignupFormData, "confirmPassword">) => {
  return await fetch(`${env.API_BASE_URL}${API_ROUTES.auth.signup}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, username }),
  });
};
