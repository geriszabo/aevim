"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { WorkoutWithoutUserId } from "@aevim/shared-types";
import { useState } from "react";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";
import { RecentWorkoutsCard } from "../dashboard/RecentWorkoutsCard";

interface PreviousWorkoutsCardProps {
  workouts: WorkoutWithoutUserId[];
}

export const PreviousWorkoutsCard = ({
  workouts,
}: PreviousWorkoutsCardProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const highlightedDates = workouts.map((workout) => new Date(workout.date));

  const currentWeekDates = date
    ? eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      })
    : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <Typography variant="heading">Previus Workouts</Typography>
      </CardHeader>
      <CardContent className="px-4">
        <Calendar
          mode="single"
          weekStartsOn={1}
          selected={date}
          onSelect={setDate}
          className="w-full bg-transparent p-2"
          modifiers={{
            workoutDays: highlightedDates,
            currentWeek: currentWeekDates,
          }}
          modifiersClassNames={{
            workoutDays: "border-1 border-dashed border-black rounded-4xl",
            currentWeek: "bg-gray-100 ",
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {workouts.map((workout) => (
            <RecentWorkoutsCard {...workout} key={workout.id} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
