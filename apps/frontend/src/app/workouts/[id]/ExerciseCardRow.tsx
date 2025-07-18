import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metric } from "@/types/metrics";
import { Trash2 } from "lucide-react";
import React from "react";

interface ExerciseCardRowProps {
  setNumber: number;
  metric?: Metric;
  reps: number;
  value: number;
  onRepsChange: (value: number) => void;
  onValueChange: (value: number) => void;
  onDelete: () => void;
}

export const ExerciseCardRow = ({
  setNumber,
  metric,
  reps,
  value,
  onRepsChange,
  onValueChange,
  onDelete,
}: ExerciseCardRowProps) => {
  const getUnit = (metricType: Metric | undefined) => {
    switch (metricType) {
      case "distance":
        return "km";
      case "duration":
        return "min";
      case "weight":
        return "kg";
      default:
        return "";
    }
  };

  const unit = getUnit(metric);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2 items-center p-2 bg-muted/50 rounded">
          <span className="text-xs font-medium"># {setNumber}</span>
          <Input
            type="number"
            className="h-8 text-xs"
            placeholder="0"
            value={reps || ""}
            onChange={(e) => onRepsChange(Number(e.target.value) || 0)}
          />
          <div className="relative col-span-2">
            <Input
              type="number"
              className="h-8 text-xs pr-8 text-right"
              placeholder="0"
              value={value || ""}
              onChange={(e) => onValueChange(Number(e.target.value) || 0)}
            />
            {unit && (
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                {unit}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 ml-auto"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
