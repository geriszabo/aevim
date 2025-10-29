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
import {
  eachDayOfInterval,
  endOfWeek,
  getWeek,
  isSameDay,
  startOfWeek,
} from "date-fns";
import { RecentWorkoutsCard } from "../dashboard/RecentWorkoutsCard";

interface PreviousWorkoutsCardProps {
  workouts: WorkoutWithoutUserId[];
}

export const PreviousWorkoutsCard = ({
  workouts,
}: PreviousWorkoutsCardProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const highlightedDates = workouts.map((workout) => new Date(workout.date));
  const currentWeekDates = date
    ? eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      })
    : [];

  const weekString = `Workouts of week ${getWeek(date)}`;
  const filteredWorkouts = workouts.filter((workout) =>
    currentWeekDates.some((weekday) =>
      isSameDay(new Date(workout.date), weekday)
    )
  );

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
          required
          showWeekNumber
          className="w-full bg-transparent p-2"
          modifiers={{
            workoutDays: highlightedDates,
            currentWeek: currentWeekDates,
          }}
          modifiersClassNames={{
            workoutDays:
              "relative bg-decor after:content-['✓'] after:absolute after:bottom-1 after:right-1 after:text-[12px] after:font-bold after:text-neongreen after:z-10 text-black dark:text-white",
            currentWeek: "bg-gray-100 dark:bg-gray-700",
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <Typography className="font-bold" size="sm" variant="body">
          {weekString}
        </Typography>
        <div className="flex w-full flex-col gap-2">
          {filteredWorkouts.length ? (
            filteredWorkouts.map((workout) => (
              <RecentWorkoutsCard {...workout} key={workout.id} />
            ))
          ) : (
            <Typography className="" size="sm" variant="body">
              No workouts this week
            </Typography>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
