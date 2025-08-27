import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { ExerciseCardHeader } from "./ExerciseCardHeader";
import { ExerciseCardInfo } from "./ExerciseCardInfo";
import { WorkoutOverview } from "@aevim/shared-types";
import { Typography } from "../ui/typography";

//TODO: make this drag and droppable
interface ExerciseCardProps {
  exercise: WorkoutOverview["exercises"][number];
  exerciseOrder: number;
}

export const ExerciseCard = ({
  exercise,
  exerciseOrder,
}: ExerciseCardProps) => {
  const { sets } = exercise;
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <ExerciseCardHeader
          name={exercise.name}
          exerciseIndex={exerciseOrder}
        />
        <ExerciseCardInfo exerciseOrder={exerciseOrder} />
      </CardHeader>

      <CardContent className="space-y-2">
        <div>
          <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground font-medium px-2 items-center">
            <span>Set</span>
            <span>Reps</span>
            <span>Metric</span>
          </div>
        </div>
        {sets.map((set, index) => {
          return (
            <div
              key={set.id}
              className="grid grid-cols-5 gap-2 items-center justify-center p-2"
            >
              <Typography variant="body" size="xs">
                #{index + 1}
              </Typography>
              <Typography variant="body" size="xs">
                {set.reps}
              </Typography>
              <Typography variant="body" size="xs" className="col-span-2">
                {set.metric_value}
              </Typography>
            </div>
          );
        })}
        <div className="pt-4 border-t">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Exercise Notes
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
