"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { WorkoutWithoutUserId } from "@aevim/shared-types";
import { addMonths, format, startOfYear } from "date-fns";

const chartConfig = {
  workout: {
    label: "Workout",
    color: "var(--color-decor)",
  },
} satisfies ChartConfig;

interface WorkoutsPerMonthProps {
  workouts: WorkoutWithoutUserId[];
}

//TODO: leave this component for now, come back when workout lenghths are stored
//display workout length per week instead of workout count

export function WorkoutFrequencyBarChart({ workouts }: WorkoutsPerMonthProps) {
  if (workouts.length <= 1) {
    return <EmptyData />;
  }

  const yearStart = startOfYear(new Date());
  const months = Array.from({ length: 12 }, (_, i) =>
    format(addMonths(yearStart, i), "MMMM"),
  );

  const getChartData = groupWorkoutsByMonth(workouts);
  const data = months.map((month) =>
    getChartData.find((data) => data.month === month)
      ? {
          month,
          workout: getChartData.find((data) => data.month === month)?.workout,
        }
      : { month, workout: 0 },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>TITLE</CardTitle>
        <CardDescription>DESCRIPTION</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="workout" fill="var(--color-workout)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

function groupWorkoutsByMonth(workouts: WorkoutWithoutUserId[]) {
  return Object.entries(
    workouts.reduce(
      (acc, workout) => {
        const month = format(workout.date, "MMMM");
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([month, workout]) => ({ month, workout }));
}

const EmptyData = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TITLE</CardTitle>
        <CardDescription>DESCRIPTION</CardDescription>
        <CardContent>This is your latest workout</CardContent>
      </CardHeader>
    </Card>
  );
};
