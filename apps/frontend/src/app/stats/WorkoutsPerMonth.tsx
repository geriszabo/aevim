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

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-decor)",
  },
} satisfies ChartConfig;

interface WorkoutsPerMonthProps {
  workouts: WorkoutWithoutUserId[];
}

export function WorkoutsPerMonth({ workouts }: WorkoutsPerMonthProps) {
  const yearStart = startOfYear(new Date());
  const months = Array.from({ length: 12 }, (_, i) =>
    format(addMonths(yearStart, i), "MMMM"),
  );

  const getChartData = groupWorkoutsByMonth(workouts);
  const data = months.map((month) =>
    getChartData.find((data) => data.month === month)
      ? {
          month,
          desktop: getChartData.find((data) => data.month === month)?.desktop,
        }
      : { month, desktop: 0 },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
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
  ).map(([month, desktop]) => ({ month, desktop }));
}
