import { WorkoutFormValues } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SetMetrics } from "@aevim/shared-types";
import { Trash2 } from "lucide-react";
import React from "react";
import { UseFieldArrayRemove, UseFormRegister } from "react-hook-form";

interface ExerciseCardSetRowProps {
  register: UseFormRegister<WorkoutFormValues>;
  exerciseIndex: number;
  setIndex: number;
  metric?: SetMetrics;
  onDelete: UseFieldArrayRemove;
}

export const ExerciseCardSetRow = ({
  register,
  exerciseIndex,
  setIndex,
  metric,
  onDelete,
}: ExerciseCardSetRowProps) => {
  const getUnit = (metricType: SetMetrics | undefined) => {
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
          <span className="text-xs font-medium"># {setIndex + 1}</span>
          <Input
            type="number"
            step="0.1"
            className="h-8 text-xs"
            placeholder="0"
            {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`, {
              valueAsNumber: true,
            })}
          />
          <div className="relative col-span-2">
            <Input
              type="number"
              step="0.1"
              className="h-8 text-xs pr-8 text-right"
              placeholder="0"
              {...register(
                `exercises.${exerciseIndex}.sets.${setIndex}.metric_value`,
                { valueAsNumber: true }
              )}
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
            onClick={() => onDelete()}
            type="button"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
