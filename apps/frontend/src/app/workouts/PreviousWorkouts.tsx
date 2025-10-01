"use server";

import { cookies } from "next/headers";
import { PreviousWorkoutsCard } from "./PreviousWorkoutsCard";
import { QueryClient } from "@tanstack/react-query";
import { getWorkouts } from "@/hooks/api/workouts/getWorkouts";

export const PreviousWorkouts = async () => {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  const { workouts } = await queryClient.fetchQuery({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(cookieStore.toString()),
  });

  return <PreviousWorkoutsCard workouts={workouts} />;
};
