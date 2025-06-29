import env from "@/env";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

export const postLogout = async () => {
  return await fetch(`${env.API_BASE_URL}${API_ROUTES.auth.logout}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};
