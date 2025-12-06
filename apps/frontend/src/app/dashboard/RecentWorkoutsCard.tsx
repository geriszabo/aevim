"use server";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Calendar, Dumbbell, TrendingUp } from "lucide-react";

import { type CompleteWorkout } from "@aevim/shared-types";
import Link from "next/link";

export const RecentWorkoutsCard = async (
  workout: CompleteWorkout["workout"],
) => {
  return (
    <Link href={`/workouts/${workout.id}`} className="block">
      <Card key={workout.id} className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-decor rounded-lg flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <Typography variant="body" size="md" className="mb-1">
                {workout.name}
              </Typography>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{workout.date}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-10 w-10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-decor " />
          </div>
        </div>
      </Card>
    </Link>
  );
};
