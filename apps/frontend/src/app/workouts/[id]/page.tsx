"use client";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Logo } from "@/components/Logo/Logo";
import { Typography } from "@/components/ui/typography";
import { use } from "react";
import { EditWorkoutSection } from "./EditWorkoutSection";
import { ExerciseSection } from "./ExerciseSection";
import { useGetWorkout } from "@/hooks/workouts/useGetWorkout";
import { DeleteWorkoutDialog } from "./DeleteWorkoutDialog";

export default function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workoutId } = use(params);
  const { data } = useGetWorkout(workoutId);

  if (!data?.workout) {
    return;
  }

  return (
    <PageContainer display={"block"}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <ContentContainer className="py-4">
          <Logo size="2xl" routeToDashboard />
        </ContentContainer>
      </header>
      <SectionContainer>
        <ContentContainer textAlign="center">
          <Typography
            variant="heading"
            size="3xl"
            className="mb-2 font-heading"
          >
            Build Your Workout
          </Typography>
          <Typography variant="muted" size="lg">
            Create the perfect session. No fluff, just results.
          </Typography>
        </ContentContainer>
      </SectionContainer>

      <EditWorkoutSection
        editWorkoutData={data.workout}
        workoutId={workoutId}
      />
      <ExerciseSection workoutId={workoutId} />
      <DeleteWorkoutDialog />
    </PageContainer>
  );
}
