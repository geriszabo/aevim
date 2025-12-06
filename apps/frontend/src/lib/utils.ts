import { SetMetrics } from "@aevim/shared-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUnit = (metricType: SetMetrics | undefined) => {
  switch (metricType) {
    case "distance":
      return "km";
    case "duration":
      return "min";
    case "weight":
      return "kg";
    default:
      return "";
  }
};

export const toSentenceCase = (string: string | undefined) => {
  if (!string) return string;
  return (
    string.toLowerCase().charAt(0).toUpperCase() + string.toLowerCase().slice(1)
  );
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
