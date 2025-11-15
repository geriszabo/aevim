"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
import exercises from "@aevim/shared-types/exercises.json";

export const description = "A radar chart";

const chartConfig = {
  desktop: {
    label: "Exercises",
    color: "var(--color-decor)",
  },
} satisfies ChartConfig;

interface PrimaryMuscleRadarChartProps {
  data: WorkoutWithoutUserId[];
}

export function PrimaryMuscleRadarChart({
  data,
}: PrimaryMuscleRadarChartProps) {
  const chartCategories = [
    "Back",
    "Full Body",
    "Chest",
    "Core",
    "Shoulders",
    "Arms",
    "Legs",
  ];

  const primaryMuscles = data
    .map((d) =>
      d.exercise_codes
        ?.map((code) => exercises.find((exercise) => exercise.id === code))
        .map((exercise) => exercise?.primaryMuscle),
    )
    .flat();

  const dateInterval = data.map((d) => d.date);
  const workoutDateInterval = `${dateInterval.at(0)}${dateInterval.at(0) !== dateInterval.at(-1) ? "-" + dateInterval.at(-1) : ""}`;
  console.log({ dateInterval });

  const mapPrimaryMuscles = primaryMuscles?.reduce(
    (acc, muscle) => {
      if (!muscle) {
        return acc;
      }
      if (!acc[muscle]) {
        acc[muscle] = 1;
      } else if (acc[muscle]) {
        acc[muscle] += 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = chartCategories.map((muscle) => ({
    muscle: muscle,
    desktop: mapPrimaryMuscles?.[muscle] || 0.1,
  }));

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Exercises breakdown</CardTitle>
        <CardDescription>Showing exercises per muscle area</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData} innerRadius={20}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="muscle" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-decor)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          {workoutDateInterval}
        </div>
      </CardFooter>
    </Card>
  );
}
