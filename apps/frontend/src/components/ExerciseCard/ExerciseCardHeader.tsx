import { Typography } from "@/components/ui/typography";
import React from "react";

interface ExerciseCardHeaderProps {
  name: string;
  exerciseIndex?: number;
}

export const ExerciseCardHeader = ({
  name,
  exerciseIndex
}: ExerciseCardHeaderProps) => {
 

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
          {exerciseIndex}
        </div>
        <Typography variant="heading" size="lg" className="font-heading">
          {name}
        </Typography>
      </div>
     
    </div>
  );
};
