import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const contentContainerVariants = cva("container mx-auto px-4", {
  variants: {
    maxWidth: {
      sm: "max-w-lg",
      md: "max-w-3xl",
      lg: "max-w-4xl",
      xl: "max-w-5xl",
      none: "",
    },
    textAlign: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    maxWidth: "none",
    textAlign: "left",
  },
});

interface ContentContainerProps extends VariantProps<typeof contentContainerVariants> {
  children: ReactNode;
  className?: string;
}

export const ContentContainer = ({
  children,
  maxWidth,
  textAlign,
  className,
}: ContentContainerProps) => {
  return (
    <div className={cn(contentContainerVariants({ maxWidth, textAlign }), className)}>
      {children}
    </div>
  );
};