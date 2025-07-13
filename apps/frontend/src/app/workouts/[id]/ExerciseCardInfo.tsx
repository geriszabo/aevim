import { Label } from "@/components/ui/label";
import React from "react";

export const ExerciseCardInfo = ({
  exerciseOrder,
}: {
  exerciseOrder: number;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">
          Sets Count
        </Label>
        <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-sm font-medium">
          3 sets
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">
          Order
        </Label>
        <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-sm font-medium text-muted-foreground">
          #{exerciseOrder}
        </div>
      </div>
    </div>
  );
};
