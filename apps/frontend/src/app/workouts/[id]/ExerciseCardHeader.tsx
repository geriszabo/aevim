import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Trash2 } from "lucide-react";
import React from "react";

export const ExerciseCardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
          1
        </div>
        <Typography variant="heading" size="lg" className="font-heading">
          exercise name
        </Typography>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
