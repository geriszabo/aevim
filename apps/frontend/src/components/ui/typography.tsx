import { TypographySize } from "@/types/utils";

interface TypographyProps {
  variant: "hero" | "heading" | "body" | "muted";
  size?: TypographySize
  children: React.ReactNode;
  className?: string;
}

export const Typography = ({
  variant,
  size,
  children,
  className,
}: TypographyProps) => {
  if (variant === "hero") {
    return (
      <h1
        className={`${
          size ? `text-${size}` : "text-6xl"
        } font-bold font-heading leading-tight bg-gradient-to-r from-gray-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent ${className}`}
      >
        {children}
      </h1>
    );
  }

  if (variant === "heading") {
    return (
      <h2
        className={`${
          size ? `text-${size}` : "text-3xl"
        } font-bold font-heading leading-tight ${className}`}
      >
        {children}
      </h2>
    );
  }
  if (variant === "muted") {
    return (
      <p
        className={`${
          size ? `text-${size}` : "text-base"
        } text-muted-foreground ${className}`}
      >
        {children}
      </p>
    );
  }

  return (
    <p className={`${size ? `text-${size}` : "text-base"} ${className}`}>
      {children}
    </p>
  );
};
