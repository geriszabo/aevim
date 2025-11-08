"use server";

import { WorkoutSection } from "./WorkoutSection";
import { ExerciseSection } from "./ExerciseSection";

import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { getCompleteWorkout } from "@/hooks/api/completeworkouts/getCompleteWorkout";

interface CompleteWorkoutParams {
  workoutId: string;
}

export const Completeworkout = async ({ workoutId }: CompleteWorkoutParams) => {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  const {
    overview: { exercises, workout },
  } = await queryClient.fetchQuery({
    queryKey: ["completeWorkout", workoutId],
    queryFn: () => getCompleteWorkout(workoutId, cookieStore.toString()),
  });

  return (
    <>
      <WorkoutSection editWorkoutData={workout} workoutId={workoutId} />
      <ExerciseSection exercises={exercises} />
    </>
  );
};
