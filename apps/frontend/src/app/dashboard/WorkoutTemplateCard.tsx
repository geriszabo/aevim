import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";

import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import React from "react";

interface WorkoutTemplateCardProps {
  id: string;
  name: string;
  exercises: number;
  lastUsed: string;
}

export const WorkoutTemplateCard = (template: WorkoutTemplateCardProps) => {
  return (
    <Card key={template.id} className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Typography variant="body" size="md" className="mb-1">
            {template.name}
          </Typography>
          <Typography variant="muted" size="sm">
            {template.exercises} exercises • {template.lastUsed}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {}}
            className="h-10 px-4 font-semibold"
          >
            START
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};
