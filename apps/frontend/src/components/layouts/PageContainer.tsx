import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageContainerVariants = cva(
  "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
  {
    variants: {
      display: {
        flex: "flex",
        grid: "grid",
        block: "block"
      },
      flexDirection: {
        row: "flex-row",
        column: "flex-col",
      },
      alignItems: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
      },
      justifyContent: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
      spacing: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
      padding: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      display: "flex", // Add this default!
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      spacing: "md",
      padding: "md",
    },
  }
);

interface PageContainerProps
  extends VariantProps<typeof pageContainerVariants> {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({
  children,
  display, // Add this prop
  flexDirection,
  alignItems,
  justifyContent,
  spacing,
  padding,
  className,
}: PageContainerProps) => {
  return (
    <div
      className={cn(
        pageContainerVariants({
          display, // Pass it to the variants
          flexDirection,
          alignItems,
          justifyContent,
          spacing,
          padding,
        }),
        className
      )}
    >
      {children}
    </div>
  );
};