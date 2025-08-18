"use client";

import { use, useMemo } from "react";
import { useGetCompleteWorkout } from "@/hooks/workouts/useGetCompleteWorkout";
import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Logo } from "@/components/Logo/Logo";
import { Typography } from "@/components/ui/typography";
import { useUpdateCompleteWorkout } from "@/hooks/completeWorkouts/useUpdateCompleteWorkout";

import { WorkoutForm } from "@/components/Form/WorkoutForm";

export default function UpdateWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workoutId } = use(params);
  const { data: completeWorkout, isLoading } = useGetCompleteWorkout(workoutId);
  const { mutate } = useUpdateCompleteWorkout(workoutId);

  const defaultValues = useMemo(() => {
    if (!completeWorkout?.overview) return null;

    const { exercises, workout } = completeWorkout.overview;

    return {
      workout: {
        name: workout?.name,
        date: workout?.date,
        notes: workout?.notes,
      },
      exercises: exercises,
    };
  }, [completeWorkout]);

  if (isLoading || !defaultValues) {
    return (
      <PageContainer display={"block"}>
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
          <ContentContainer className="py-4">
            <Logo size="2xl" routeToDashboard />
          </ContentContainer>
        </header>
        <SectionContainer>
          <div className="flex justify-center items-center h-64">
            <Typography variant="heading">Loading workout...</Typography>
          </div>
        </SectionContainer>
      </PageContainer>
    );
  }

  return <WorkoutForm defaultValues={defaultValues} mutate={mutate} />;
}
