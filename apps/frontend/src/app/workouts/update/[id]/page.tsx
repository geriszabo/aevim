"use client";

import { use } from "react";

import { useGetCompleteWorkout } from "@/hooks/workouts/useGetCompleteWorkout";
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
import { WorkoutData } from "@aevim/shared-types/schemas/workout-schema";
import { useUpdateCompleteWorkout } from "@/hooks/completeWorkouts/useUpdateCompleteWorkout";
import { WorkoutFormValues } from "../../create/page";
import { CreateExerciseDataForm } from "../../create/CreateExerciseDataForm";
import { UpdateCompleteWorkoutData } from "@aevim/shared-types";

export default function UpdateWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workoutId } = use(params);
  const { data: completeWorkout } = useGetCompleteWorkout(workoutId);
  const { mutate } = useUpdateCompleteWorkout(workoutId);
 
  const overview = completeWorkout?.overview
  const workout = overview?.workout;
  const exercises = overview?.exercises;
  const defaultValues = {
    workout: {
      name: workout?.name,
      date: workout?.date,
      notes: workout?.notes,
    },
    exercises: exercises,
  };

  console.log({defaultValues})
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UpdateCompleteWorkoutData>({
    defaultValues: {
      workout: {
        name: workout?.name,
        date: workout?.date,
        notes: workout?.notes,
      },
      exercises: exercises,
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
    console.log({ data });
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
