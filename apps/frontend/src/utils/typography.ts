import { TypographySize } from "@/types/utils";

const sizeClasses: Record<TypographySize, string> = {
  "xs": "text-xs",
  "sm": "text-sm",
  "md": "text-md",
  "lg": "text-lg",
  "xl": "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
};

export const getTextSize = (size: TypographySize) => {
  return sizeClasses[size];
};
