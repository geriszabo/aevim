import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import React from "react";
import { EmptyExerciseListPlaceholder } from "./EmptyExerciseListPlaceholder";
import { ExerciseCard } from "../../../components/ExerciseCard/ExerciseCard";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { ContentContainer } from "@/components/layouts/ContentContainer";
import { CompleteWorkout } from "@aevim/shared-types";

interface ExerciseSectionProps {
  exercises: CompleteWorkout["exercises"];
}

export const ExerciseSection = ({ exercises }: ExerciseSectionProps) => {
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
                    {exercises.length} total exercises
                  </Typography>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {exercises.length === 0 ? (
              <EmptyExerciseListPlaceholder />
            ) : (
              exercises.map((exercise, index) => (
                <ExerciseCard
                  exercise={exercise}
                  exerciseOrder={index + 1}
                  key={exercise.id}
                />
              ))
            )}
          </CardContent>
        </Card>
      </ContentContainer>
    </SectionContainer>
  );
};
