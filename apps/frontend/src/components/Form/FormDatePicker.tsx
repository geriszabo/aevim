"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FieldError,
  FieldValues,
  Path,
  Control,
  Controller,
} from "react-hook-form";
import { format } from "date-fns";

interface FormDatePickerProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  control: Control<T>;
  error?: FieldError;
  placeholder?: string;
  className?: string;
}

export function FormDatePicker<T extends FieldValues>({
  id,
  label,
  control,
  error,
  placeholder = "Select date",
  className,
}: FormDatePickerProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={id}
                className={`w-full justify-between font-normal h-12 ${
                  className || ""
                }`}
              >
                {field.value
                  ? format(new Date(field.value), "dd/MM/yyyy")
                  : placeholder}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date) {
                    // Format date as YYYY-MM-DD in local timezone
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const formattedDate = `${year}-${month}-${day}`;
                    field.onChange(formattedDate);
                  } else {
                    field.onChange("");
                  }
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
