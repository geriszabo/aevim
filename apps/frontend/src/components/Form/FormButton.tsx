import { Button } from "@/components/ui/button";
import { ComponentProps, ReactNode } from "react";

interface FormButtonProps extends ComponentProps<"button"> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export const FormButton = ({
  isLoading = false,
  loadingText = "Loading...",
  children,
  disabled,
  ...props
}: FormButtonProps) => {
  return (
    <Button
      disabled={isLoading || disabled}
      className="w-full h-12 text-base font-bold font-heading uppercase "
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current uppercase" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
