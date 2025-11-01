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

export const toSentenceCase = (str: string | undefined): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
