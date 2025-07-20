import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useDeleteExerciseOfWorkout } from "@/hooks/exercises/useDeleteExerciseOfWorkout";
import { Trash2 } from "lucide-react";
import React from "react";

interface ExerciseCardHeaderProps {
  name: string;
  workoutId: string;
  exerciseId: string;
}

export const ExerciseCardHeader = ({
  name,
  exerciseId,
  workoutId,
}: ExerciseCardHeaderProps) => {
  const { mutate } = useDeleteExerciseOfWorkout(workoutId, exerciseId);

  const handleDelete = () => {
    mutate();
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
          1
        </div>
        <Typography variant="heading" size="lg" className="font-heading">
          {name}
        </Typography>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
