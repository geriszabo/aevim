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

export function ExerciseCardMetricSelect() {
  return (
    <Select>
      <SelectTrigger className="max-w-[180px] text-xs border-none shadow-none p-0" size="sm" >
        <SelectValue placeholder="Metric" />
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
