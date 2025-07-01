import { TypographySize } from "@/types/utils";
import { getTextSize } from "@/utils/typography";

export const Logo = ({ size = "5xl", text = "aevim" }: { size?: TypographySize, text?: string }) => {
  const textSize = getTextSize(size)
  return (
    <span className={`relative ${textSize} font-bold font-heading`}>
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
