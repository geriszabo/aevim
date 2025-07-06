import { Typography } from "@/components/ui/typography";
import { Dumbbell } from "lucide-react";
import React from "react";

export const EmptyExerciseListPlaceholder = () => {
  return (
    <div className="text-center py-16">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Dumbbell className="h-8 w-8 text-muted-foreground" />
      </div>
      <Typography variant="heading" size="lg" className="mb-2">
        No exercises yet
      </Typography>
      <Typography variant="muted" className="mb-6">
        Add exercises to build your perfect workout
      </Typography>
    </div>
  );
};
