"use client";

import { useUpdateCompleteWorkout } from "@/hooks/completeWorkouts/useUpdateCompleteWorkout";

import { WorkoutForm } from "@/components/Form/WorkoutForm";
import {
  CreateCompleteWorkoutData,
  UpdateCompleteWorkoutData,
} from "@aevim/shared-types";

export const WorkoutFormParent = ({
  defaultValues,
  workoutId,
}: {
  defaultValues: UpdateCompleteWorkoutData | CreateCompleteWorkoutData;
  workoutId: string;
}) => {
  const { mutate } = useUpdateCompleteWorkout(workoutId);
  return <WorkoutForm defaultValues={defaultValues} mutate={mutate} />;
};
