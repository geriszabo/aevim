"use client";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Logo } from "@/components/Logo/Logo";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FormButton } from "@/components/Form/FormButton";
import { CreateWorkoutData } from "@/schemas/create-workout-schema";
import { useFieldArray, useForm } from "react-hook-form";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import { CreateExerciseDataForm } from "./CreateExerciseDataForm";

export type WorkoutFormValues = {
  workoutData: CreateWorkoutData;
  exercises: {
    name: string;
    category?: string | null | undefined;
    notes?: string | null | undefined;
    sets: {reps: number, value: number}[];
  }[];
};

export default function WorkoutPage() {
  const {
    register,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<WorkoutFormValues>({
    defaultValues: {
      workoutData: {
        name: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      },
      exercises: [],
    },
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
      sets: [],
    });
  };

  const onSubmit = (data: WorkoutFormValues) => {
    console.log(data);
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
            id="workoutData.name"
            label="Workout name"
            register={register}
            type="text"
            error={errors.workoutData?.name}
            placeholder="Gym session"
          />
          <FormDatePicker
            id="workoutData.date"
            label="Date"
            control={control}
            error={errors.workoutData?.date}
            placeholder="Select workout date"
          />
          <FormTextareaField
            id="workoutData.notes"
            label="Notes for the workout"
            error={errors.workoutData?.notes}
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
            />
          ))}
          <Button onClick={handleAddExercise} variant="outline" className="w-full font-heading mb-4">
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
