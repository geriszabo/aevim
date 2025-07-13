import env from "@/env";
import { CreateSetData } from "@/schemas/create-set-schema";
import { handleApiError } from "@/utils/handleApiError";
import { API_ROUTES } from "@aevim/shared-types/api-routes";

interface PostSetProps {
  workoutId: string;
  exerciseId: string;
  setData: CreateSetData;
}

export const postSet = async ({
  setData,
  workoutId,
  exerciseId,
}: PostSetProps) => {
  const response = await fetch(
    `${env.API_BASE_URL}${API_ROUTES.sets.base(workoutId, exerciseId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...setData }),
    }
  );

  if (!response.ok) {
    handleApiError(response);
  }

  return response.json();
};
