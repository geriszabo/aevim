"use client";

import { WorkoutForm } from "@/components/Form/WorkoutForm";
import { useCreateCompleteWorkout } from "@/hooks/workouts/useCreateCompleteWorkout";
import { format } from "date-fns";

export default function WorkoutPage() {
  const { mutate } = useCreateCompleteWorkout();

  const workoutDefaultName = `${format(new Date(), "cccc", )} workout / ${format(new Date(), "do MMMM")}`
  const defaultValues = {
    workout: {
      name: workoutDefaultName,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
    exercises: [],
  };

  return <WorkoutForm defaultValues={defaultValues} mutate={mutate} />;
}
