import { FormButton } from "@/components/Form/FormButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import React from "react";
import { EmptyExerciseListPlaceholder } from "./EmptyExerciseListPlaceholder";
import { ExerciseCard } from "./ExerciseCard";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { ContentContainer } from "@/components/layouts/ContentContainer";
import { useCreateExerciseToWorkout } from "@/hooks/exercises/useCreateExerciseToWorkout";

export const ExerciseSection = ({ workoutId }: { workoutId: string }) => {
  const exercises = true;
  const { mutate, data } = useCreateExerciseToWorkout(workoutId);

  console.log(data);

  return (
    <SectionContainer padding="sm">
      <ContentContainer>
        <Card className="shadow-lg w-full max-w-4xl mx-auto">
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
                onClick={() => mutate({ name: "dick", category: "cardio" })}
                className="font-bold font-heading"
              >
                <Plus className="h-4 w-4 mr-2" />
                NEW
              </FormButton>
            </div>
          </CardHeader>
          <CardContent>
            {!exercises && <EmptyExerciseListPlaceholder />}

            <ExerciseCard name="placeholder" category="placeholder as well" />
          </CardContent>
        </Card>
      </ContentContainer>
    </SectionContainer>
  );
};
