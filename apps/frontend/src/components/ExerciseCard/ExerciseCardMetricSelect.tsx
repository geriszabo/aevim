import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Metric } from "@/types/metrics";

interface ExerciseCardMetricSelectProps {
  value?: string;
  onValueChange?: (value: Metric) => void;
  placeholder?: string;
}

export function ExerciseCardMetricSelect({
  value,
  onValueChange,
  placeholder = "Metric",
}: ExerciseCardMetricSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className="max-w-[180px] text-xs border-none shadow-none p-0"
        size="sm"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Metrics</SelectLabel>
          <SelectItem value="weight">Weight</SelectItem>
          <SelectItem value="duration">Duration</SelectItem>
          <SelectItem value="distance">Distance</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
