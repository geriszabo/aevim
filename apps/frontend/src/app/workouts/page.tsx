"use server";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { StartNewWorkout } from "./StartNewWorkout";
import { PreviousWorkouts } from "./PreviousWorkouts";

export default async function WorkoutPage() {
  return (
    <PageContainer>
      <ContentContainer>
        <StartNewWorkout />
      </ContentContainer>
      <ContentContainer>
        <PreviousWorkouts />
      </ContentContainer>
    </PageContainer>
  );
}
