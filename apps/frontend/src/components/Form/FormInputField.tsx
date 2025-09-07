import { ComponentProps, ReactNode } from "react";
import { Input } from "../ui/input";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Label } from "../ui/label";

interface FormInputFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  icon?: ReactNode;
  register: UseFormRegister<T>;
  type: ComponentProps<"input">["type"];
  placeholder?: string;
  autoComplete?: ComponentProps<"input">["autoComplete"];
  autoFocus?: boolean;
  className?: ComponentProps<"input">["className"];
  error?: FieldError;
}

export const FormInputField = <T extends FieldValues>({
  label,
  icon,
  id,
  type,
  register,
  placeholder,
  autoComplete,
  autoFocus = false,
  error,
}: FormInputFieldProps<T>) => {
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
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${icon ? "pl-10" : ""} h-12 bg-white`}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...register(id)}
        />
      </div>
      {<p className="text-sm text-red-500">{error?.message}</p>}
    </div>
  );
};
