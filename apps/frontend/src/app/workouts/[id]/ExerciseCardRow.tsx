import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import React from "react";

export const ExerciseCardRow = () => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2 items-center p-2 bg-muted/50 rounded">
          <span className="text-xs font-medium">#2</span>
          <Input type="number" className="h-8 text-xs" placeholder="0" />
          <Input type="number" className="h-8 text-xs" placeholder="0" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 ml-auto"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
