import { TypographySize } from "@/types/utils";

export const Logo = ({ size = "5xl" }: { size?: TypographySize }) => {
  return (
    <span className={`relative text-${size} font-bold font-heading`}>
      <span
        className={`absolute text-${size} font-bold font-heading text-hotpink`}
        style={{
          transform: "translate(-3px, -2px)",
          mixBlendMode: "multiply",
        }}
      >
        aevim
      </span>
      <span
        className={`absolute text-${size} font-bold font-heading text-neongreen`}
        style={{
          transform: "translate(3px, 2px)",
          mixBlendMode: "multiply",
        }}
      >
        aevim
      </span>
      <span className="relative z-10 text-foreground">aevim</span>
    </span>
  );
};
