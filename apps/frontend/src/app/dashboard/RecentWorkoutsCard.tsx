import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Calendar, Dumbbell, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { type WorkoutOverview } from "@aevim/shared-types";

export const RecentWorkoutsCard = (workout: WorkoutOverview["workout"]) => {
  const router = useRouter();
  
  return (
    <Card
      key={workout.id}
      className="p-4"
      onClick={() => router.push(`/workouts/${workout.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
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

        <Button variant="ghost" size="icon" className="h-10 w-10">
          <TrendingUp className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
