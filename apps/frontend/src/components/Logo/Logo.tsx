"use client";

import { TypographySize } from "@/types/utils";
import { getTextSize } from "@/utils/typography";
import { useRouter } from "next/navigation";

interface LogoProps {
  size?: TypographySize;
  text?: string;
  routeToDashboard?: boolean;
  onClick?: () => void;
}

export const Logo = ({
  size = "5xl",
  text = "aevim",
  routeToDashboard,
  onClick
}: LogoProps) => {
  const textSize = getTextSize(size);
  const router = useRouter();
  return (
    <span
      className={`relative ${textSize} font-bold font-heading`}
      onClick={routeToDashboard ? () => router.push("/dashboard") : onClick}
    >
      <span
        className={`absolute ${textSize} font-bold font-heading text-hotpink`}
        style={{
          transform: "translate(-3px, -2px)",
          mixBlendMode: "multiply",
        }}
      >
        {text}
      </span>
      <span
        className={`absolute ${textSize} font-bold font-heading text-neongreen`}
        style={{
          transform: "translate(3px, 2px)",
          mixBlendMode: "multiply",
        }}
      >
        {text}
      </span>
      <span className="relative z-10 text-foreground">{text}</span>
    </span>
  );
};
