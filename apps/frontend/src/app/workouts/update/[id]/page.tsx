"use server";

import { QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getWorkoutOverview } from "@/hooks/api/workouts/getWorkoutOverview";
import { WorkoutFormParent } from "./WorkoutFormParent";

export default async function UpdateWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const workoutId = (await params).id;
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  const {
    overview: { exercises, workout },
  } = await queryClient.fetchQuery({
    queryKey: ["completeWorkout", workoutId],
    queryFn: () => getWorkoutOverview(workoutId, cookieStore.toString()),
  });

  const defaultValues = {
    workout: {
      name: workout?.name ?? "",
      date: workout?.date ?? "",
      notes: workout?.notes ?? "",
    },
    exercises: exercises ?? [],
  };
  
  return (
    <WorkoutFormParent defaultValues={defaultValues} workoutId={workoutId} />
  );
}
