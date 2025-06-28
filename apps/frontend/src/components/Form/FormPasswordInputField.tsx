import { Label } from "@radix-ui/react-label";
import { ComponentProps, useState } from "react";
import { Input } from "../ui/input";

import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "../ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";

interface FormPasswordInputFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  icon?: boolean;
  register: UseFormRegister<T>;
  placeholder?: string;
  autoComplete?: ComponentProps<"input">["autoComplete"];
  autoFocus?: boolean;
  className?: ComponentProps<"input">["className"];
  error?: FieldError;
}

export const FormPasswordInputField = <T extends FieldValues>({
  label,
  icon,
  id,
  register,
  placeholder,
  autoComplete,
  autoFocus = false,
  error,
}: FormPasswordInputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`${icon ? "pl-10" : ""} pr-8 h-12 `}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...register(id)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {<p className="text-sm text-red-500">{error?.message}</p>}
    </div>
  );
};
