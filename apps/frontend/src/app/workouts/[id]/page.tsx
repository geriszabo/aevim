"use server";

import { PageContainer } from "@/components/layouts/PageContainer";
import { DeleteWorkoutDialog } from "./DeleteWorkoutDialog";
import { Completeworkout } from "./Completeworkout";
import { UpdateWorkout } from "./UpdateWorkout";
import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { getCompleteWorkout } from "@/hooks/api/completeworkouts/getCompleteWorkout";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const workoutId = (await params).id;
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  const { overview: completeWorkout } = await queryClient.fetchQuery({
    queryKey: ["completeWorkout", workoutId],
    queryFn: () => getCompleteWorkout(workoutId, cookieStore.toString()),
  });

  return (
    <PageContainer display={"block"}>
      <Completeworkout workoutId={workoutId} />
      <div className="flex flex-col gap-2">
        <UpdateWorkout completeWorkout={completeWorkout} />
        <DeleteWorkoutDialog workoutId={workoutId} />
      </div>
    </PageContainer>
  );
}
