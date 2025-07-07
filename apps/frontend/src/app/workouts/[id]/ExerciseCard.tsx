import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { ExerciseCardHeader } from "./ExerciseCardHeader";
import { ExerciseCardInfo } from "./ExerciseCardInfo";
import { ExerciseCardRow } from "./ExerciseCardRow";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

//TODO: make this drag and droppable
interface ExerciseCardProps {
  name: string;
  category?: string;
}

export const ExerciseCard = ({ name, category }: ExerciseCardProps) => {
  return (
    <div className="space-y-4">
      <div className="group relative border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-4">
            <ExerciseCardHeader name={name} category={category} />
            <ExerciseCardInfo />
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
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium px-2">
              <span>Set</span>
              <span>Reps</span>
              <span>Weight</span>
            </div>
            <ExerciseCardRow />
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Exercise Notes
              </Label>
              <Input
                placeholder="Add notes for this exercise..."
                className="h-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
