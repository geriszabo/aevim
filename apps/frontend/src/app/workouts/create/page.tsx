"use client";

import { WorkoutForm } from "@/components/Form/WorkoutForm";
import { useCreateCompleteWorkout } from "@/hooks/workouts/useCreateCompleteWorkout";

export default function WorkoutPage() {
  const { mutate } = useCreateCompleteWorkout();
  const defaultValues = {
    workout: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
    exercises: [],
  };

  return <WorkoutForm defaultValues={defaultValues} mutate={mutate} />;
}
