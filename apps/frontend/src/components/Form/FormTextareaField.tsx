import { Label } from "@radix-ui/react-label";
import { ComponentProps, ReactNode } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface FormTextareaFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  icon?: ReactNode;
  register: UseFormRegister<T>;
  placeholder?: string;
  autoComplete?: ComponentProps<"input">["autoComplete"];
  autoFocus?: boolean;
  className?: ComponentProps<"input">["className"];
  error?: FieldError;
}

export const FormTextareaField = <T extends FieldValues>({
  label,
  icon,
  id,
  register,
  placeholder,
  autoComplete,
  autoFocus = false,
  error,
}: FormTextareaFieldProps<T>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <Textarea
          id={id}
          placeholder={placeholder}
          className={`${icon ? "pl-10" : ""} h-28 resize-none bg-white`}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...register(id)}
        />
      </div>
      {<p className="text-sm text-red-500">{error?.message}</p>}
    </div>
  );
};
