import env from "@/env";
import { handleApiError } from "@/lib/handleApiError";

type ApiClientOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, unknown>;
  cookie?: string;
  queryParams?: Record<string, string | number | boolean | undefined>;
};

const buildQueryString = (
  params: Record<string, string | number | boolean | undefined>,
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!!value) {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ?? "";
};

export const apiClient = async <T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> => {
  const { method = "GET", body, cookie, queryParams } = options;

  const queryString = queryParams ? `?${buildQueryString(queryParams)}` : "";
  const url = `${env.API_BASE_URL}${endpoint}${queryString}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie && { Cookie: cookie }),
    },
    credentials: "include",
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    if (cookie) {
      throw new Error(`Failed to ${method} ${endpoint}`);
    } else {
      handleApiError(response);
    }
  }

  return response.json();
};

export const mapPrimaryMuscles = (primaryMuscles: (string | undefined)[]) => {
  return primaryMuscles?.reduce(
    (acc, muscle) => {
      if (!muscle) {
        return acc;
      }
      if (!acc[muscle]) {
        acc[muscle] = 1;
      } else if (acc[muscle]) {
        acc[muscle] += 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
};
