"use server";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Typography } from "@/components/ui/typography";
import { WorkoutsPerMonth } from "./WorkoutsPerMonth";
import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { getWorkouts } from "@/hooks/api/workouts/getWorkouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfYear } from "date-fns";
import { PrimaryMuscleRadarChart } from "./PrimaryMuscleRadarChart";

//TODO: https://www.shadcnblocks.com/group/stats here

const Stats = async () => {
  const startDate = format(startOfYear(new Date()), "yyyy-MM-dd");

  const cookieStore = await cookies();
  const queryClient = new QueryClient();
  const { workouts } = await queryClient.fetchQuery({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(cookieStore.toString(), { startDate }),
  });

  console.log({ workouts });
  return (
    <PageContainer>
      <ContentContainer>
        <Typography variant="heading">Statistics</Typography>
        <Tabs defaultValue="last" className="mt-8">
          <TabsList className="w-full">
            <TabsTrigger value="last">Last workout</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="last">
            <WorkoutsPerMonth workouts={workouts} />
          </TabsContent>
          <TabsContent value="weekly">
            <WorkoutsPerMonth workouts={workouts} />
          </TabsContent>
          <TabsContent value="monthly">
            <WorkoutsPerMonth workouts={workouts} />
          </TabsContent>
          <TabsContent value="yearly">
            <WorkoutsPerMonth workouts={workouts} />
          </TabsContent>
        </Tabs>
        <PrimaryMuscleRadarChart data={workouts[1]} />
      </ContentContainer>
    </PageContainer>
  );
};

export default Stats;
