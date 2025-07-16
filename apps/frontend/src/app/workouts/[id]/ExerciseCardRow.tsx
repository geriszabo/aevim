import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metric } from "@/types/metrics";
import { Trash2 } from "lucide-react";
import React from "react";

interface ExerciseCardRowProps {
  setNumber?: number;
  metric?: Metric;
}

export const ExerciseCardRow = ({
  setNumber = 1,
  metric,
}: ExerciseCardRowProps) => {
  const getUnit = (metricType: Metric | undefined) => {
    switch (metricType) {
      case "distance":
        return "km";
      case "duration":
        return "min";
      case "weight":
        return "kg"
      default:
        return "";
    }
  };
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2 items-center p-2 bg-muted/50 rounded">
          <span className="text-xs font-medium"># {setNumber}</span>
          <Input type="number" className="h-8 text-xs" placeholder="0" />
          <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground col-span-2">
          <Input type="number" className="h-8 text-xs" placeholder="0" />
           {getUnit(metric)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 ml-auto"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
