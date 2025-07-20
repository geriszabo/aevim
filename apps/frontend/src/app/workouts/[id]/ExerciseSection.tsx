import { FormButton } from "@/components/Form/FormButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { EmptyExerciseListPlaceholder } from "./EmptyExerciseListPlaceholder";
import { ExerciseCard } from "../../../components/ExerciseCard/ExerciseCard";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { ContentContainer } from "@/components/layouts/ContentContainer";
import { useGetExercisesOfWorkout } from "@/hooks/exercises/useGetExercisesOfWorkout";
import { CreateExerciseToWorkoutDialog } from "./CreateExerciseToWorkoutDialog";

export const ExerciseSection = ({ workoutId }: { workoutId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: exercisesOfWorkout } = useGetExercisesOfWorkout(workoutId);

  const exercises = exercisesOfWorkout?.exercises;

  console.log(exercises);

  return (
    <SectionContainer padding="sm">
      <ContentContainer>
        <Card className="shadow-md w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="font-heading text-xl">
                    Exercises
                  </CardTitle>
                  <Typography variant="muted" size="sm">
                    6 total sets
                  </Typography>
                </div>
              </div>
              <FormButton
                onClick={() => setIsOpen(true)}
                className="font-bold font-heading"
              >
                <Plus className="h-4 w-4 mr-2" />
                NEW
              </FormButton>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {!exercisesOfWorkout?.exercises.length && (
              <EmptyExerciseListPlaceholder />
            )}
            {exercises &&
              exercises.map((exercise, index) => (
                <ExerciseCard
                  {...exercise}
                  exerciseOrder={index + 1}
                  exerciseId={exercise.exercise_id}
                  workoutId={workoutId}
                  key={exercise.id}
                />
              ))}
          </CardContent>
        </Card>
        <CreateExerciseToWorkoutDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          workoutId={workoutId}
        />
      </ContentContainer>
    </SectionContainer>
  );
};
