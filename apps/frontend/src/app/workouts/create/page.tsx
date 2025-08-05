"use client";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Logo } from "@/components/Logo/Logo";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FormButton } from "@/components/Form/FormButton";
import { useFieldArray, useForm } from "react-hook-form";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import { CreateExerciseDataForm } from "./CreateExerciseDataForm";
import { useCreateCompleteWorkout } from "@/hooks/workouts/useCreateCompleteWorkout";
import { WorkoutData } from "@aevim/shared-types/workout-schema";

export type WorkoutFormValues = {
  workout: WorkoutData;
  exercises: {
    name: string;
    category?: string | null | undefined;
    notes?: string;
    metric: string;
    sets: { reps: number; value: number }[];
  }[];
};

export default function WorkoutPage() {
  const { mutate } = useCreateCompleteWorkout();
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<WorkoutFormValues>({
    defaultValues: {
      workout: {
        name: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      },
      exercises: [],
    },
    mode: "onSubmit",
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control,
    name: "exercises",
  });

  const handleAddExercise = () => {
    appendExercise({
      name: "",
      category: "",
      notes: "",
      metric: "",
      sets: [
        {
          reps: 0,
          value: 0,
        },
      ],
    });
  };

  const onSubmit = (data: WorkoutFormValues) => {
    mutate({ ...data });
  };

  return (
    <PageContainer display={"block"}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <ContentContainer className="py-4">
          <Logo size="2xl" routeToDashboard />
        </ContentContainer>
      </header>
      <SectionContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInputField
            id="workout.name"
            label="Workout name"
            register={register}
            type="text"
            error={errors.workout?.name}
            placeholder="Gym session"
          />
          <FormDatePicker
            id="workout.date"
            label="Date"
            control={control}
            error={errors.workout?.date}
            placeholder="Select workout date"
          />
          <FormTextareaField
            id="workout.notes"
            label="Notes for the workout"
            error={errors.workout?.notes}
            placeholder="Heavy session, saw a hot girl doing lifts"
            register={register}
          />
          <Typography variant="heading" size="2xl" className="py-4">
            Exercises
          </Typography>
          {exerciseFields.map((field, index) => (
            <CreateExerciseDataForm
              key={index}
              register={register}
              control={control}
              id={index}
              onDelete={() => removeExercise(index)}
              errors={errors.exercises?.[index] || {}}
              onNewSetAppending={getValues}
            />
          ))}
          <Button
            onClick={handleAddExercise}
            variant="outline"
            className="w-full font-heading mb-4"
            type="button"
          >
            Add exercise
          </Button>
          <FormButton loadingText="Saving workout..." type="submit">
            Save workout
          </FormButton>
        </form>
      </SectionContainer>
    </PageContainer>
  );
}
