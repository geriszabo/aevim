import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionContainerVariants = cva("", {
  variants: {
    background: {
      default: "",
      white: "bg-white dark:bg-black",
      gray: "bg-slate-50 dark:bg-slate-900",
    },
    padding: {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-20",
    },
    hasId: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    background: "default",
    padding: "lg",
    hasId: false,
  },
});

interface SectionContainerProps
  extends VariantProps<typeof sectionContainerVariants> {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionContainer = ({
  children,
  background,
  padding,
  className,
  id,
}: SectionContainerProps) => {
  return (
    <section
      id={id}
      className={cn(
        sectionContainerVariants({ background, padding }),
        className
      )}
    >
      {children}
    </section>
  );
};
