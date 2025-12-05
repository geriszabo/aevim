"use client";

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
import { mapPrimaryMuscles } from "@/hooks/helpers";
import { Typography } from "@/components/ui/typography";

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
  const primaryMuscles = data
    .map((d) =>
      d.exercise_codes
        ?.map((code) => exercises.find((exercise) => exercise.id === code))
        .map((exercise) => exercise?.primaryMuscle)
    )
    .flat();

  const dateInterval = data.map((d) => d.date);
  const cardFooterString =
    data && data.length
      ? `${dateInterval.at(0)}${dateInterval.at(0) !== dateInterval.at(-1) ? "-" + dateInterval.at(-1) : ""}`
      : "";

  const primaryMusclesSummary = mapPrimaryMuscles(primaryMuscles);

  const chartData = chartCategories.map((muscle) => ({
    muscle: muscle,
    desktop: primaryMusclesSummary?.[muscle] || 0.1
  }));

  console.log(data);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Exercises breakdown</CardTitle>
        <CardDescription>Showing exercises per muscle area</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {!data || data.length === 0 ? (
          <Typography variant="muted">No data available yet</Typography>
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          {cardFooterString}
        </div>
      </CardFooter>
    </Card>
  );
}

const chartCategories = [
  "Back",
  "Full Body",
  "Chest",
  "Core",
  "Shoulders",
  "Arms",
  "Legs",
] as const;
