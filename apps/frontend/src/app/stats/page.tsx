"use server";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Typography } from "@/components/ui/typography";
import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { getWorkouts } from "@/hooks/api/workouts/getWorkouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  format,
  isThisMonth,
  isThisWeek,
  isThisYear,
  startOfYear,
} from "date-fns";
import { PrimaryMuscleRadarChart } from "./PrimaryMuscleRadarChart";
import { WorkoutWithoutUserId } from "@aevim/shared-types";

//TODO: https://www.shadcnblocks.com/group/stats here

export type TabValues = "last" | "weekly" | "monthly" | "yearly";
type WorkoutsAndDates = {
  value: TabValues;
  label: string;
  workouts: WorkoutWithoutUserId[];
}[];

const Stats = async () => {
  const startDate = format(startOfYear(new Date()), "yyyy-MM-dd");
  const cookieStore = await cookies();

  const queryClient = new QueryClient();
  const { workouts } = await queryClient.fetchQuery({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(cookieStore.toString(), { startDate }),
  });

  const workoutsAndDates: WorkoutsAndDates = [
    { value: "last", label: "Last workout", workouts: [workouts[0]] },
    {
      value: "weekly",
      label: "This week",
      workouts: workouts.filter((w) => isThisWeek(w.date)),
    },
    {
      value: "monthly",
      label: "This month",
      workouts: workouts.filter((w) => isThisMonth(w.date)),
    },
    {
      value: "yearly",
      label: "This year",
      workouts: workouts.filter((w) => isThisYear(w.date)),
    },
  ];

  console.log({ workoutsAndDates });

  return (
    <PageContainer>
      <ContentContainer>
        <Typography variant="heading">Statistics</Typography>
        <Tabs defaultValue="last" className="mt-8">
          <TabsList className="w-full">
            {workoutsAndDates.map((workoutTab) => (
              <TabsTrigger value={workoutTab.value} key={workoutTab.value}>
                {workoutTab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {workoutsAndDates.map((workoutTab) => (
            <TabsContent value={workoutTab.value} key={workoutTab.value}>
              <PrimaryMuscleRadarChart data={workoutTab.workouts} />
            </TabsContent>
          ))}
        </Tabs>
      </ContentContainer>
    </PageContainer>
  );
};

export default Stats;
