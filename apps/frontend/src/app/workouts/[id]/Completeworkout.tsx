"use client"

import { WorkoutSection } from "./WorkoutSection";
import { ExerciseSection } from "./ExerciseSection";
import { useGetCompleteWorkout } from "@/hooks/workouts/useGetCompleteWorkout";

interface CompleteWorkoutParams {
  workoutId: string;
}

export const Completeworkout = ({ workoutId }: CompleteWorkoutParams) => {
  const { data: completeWorkout } = useGetCompleteWorkout(workoutId);

  if(!completeWorkout || !completeWorkout.overview) {
    return <div>No workout data available.</div>;
  }

  return (
    <>
      <WorkoutSection
        editWorkoutData={completeWorkout?.overview?.workout}
        workoutId={workoutId}
      />
      <ExerciseSection exercises={completeWorkout.overview.exercises} />
    </>
  );
};
