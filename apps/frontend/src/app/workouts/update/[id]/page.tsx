"use server";

import { QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getCompleteWorkout } from "@/hooks/api/completeworkouts/getCompleteWorkout";
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
    queryFn: () => getCompleteWorkout(workoutId, cookieStore.toString()),
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
