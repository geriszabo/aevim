import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { ExerciseCardHeader } from "./ExerciseCardHeader";
import { ExerciseCardInfo } from "./ExerciseCardInfo";
import { ExerciseCardRow } from "./ExerciseCardRow";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExerciseCardMetricSelect } from "./ExerciseCardMetricSelect";
import { FormButton } from "@/components/Form/FormButton";
import { useState } from "react";
import { Metric } from "@/types/metrics";

//TODO: make this drag and droppable
interface ExerciseCardProps {
  name: string;
  category?: string | null;
  notes?: string | null;
  workoutId: string;
  exerciseId: string;
  exerciseOrder: number;
}

export const ExerciseCard = ({
  name,
  exerciseId,
  workoutId,
  notes,
  exerciseOrder,
}: ExerciseCardProps) => {
  const [selectedMetric, setSelectedMetric] = useState<Metric>();
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <ExerciseCardHeader
          name={name}
          workoutId={workoutId}
          exerciseId={exerciseId}
        />
        <ExerciseCardInfo exerciseOrder={exerciseOrder} />
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Sets Section */}
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Sets</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            className="h-8 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Set
          </Button>
        </div>

        {/* Sets Table Header */}
        <div>
          <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground font-medium px-2 items-center">
            <span>Set</span>
            <span>Reps</span>
            <ExerciseCardMetricSelect
              value={selectedMetric}
              onValueChange={setSelectedMetric}
            />
          </div>

          {/* Sets List */}
          <ExerciseCardRow metric={selectedMetric} />
        </div>

        {/* Exercise Notes Section */}
        <div className="pt-4 border-t">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Exercise Notes
          </Label>
          <Input
            placeholder="Add notes for this exercise..."
            className="h-10 mb-3 text-xs"
            defaultValue={notes ?? ""}
          />
          <FormButton type="submit" loadingText="Saving...">
            Save exercise
          </FormButton>
        </div>
      </CardContent>
    </Card>
  );
};
