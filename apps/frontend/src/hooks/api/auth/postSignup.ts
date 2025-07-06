import env from "@/env";
import { SignupFormData } from "@/schemas/signup-schema";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const postSignup = async ({
  email,
  password,
  username,
}: Omit<SignupFormData, "confirmPassword">) => {
  const response = await fetch(`${env.API_BASE_URL}${API_ROUTES.auth.signup}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, username }),
  });

  if (!response.ok) {
   handleApiError(response)
  }

  return response.json();
};
