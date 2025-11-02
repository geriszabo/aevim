import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FormButton } from "@/components/Form/FormButton";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import {
  CreateCompleteWorkoutData,
  UpdateCompleteWorkoutData,
} from "@aevim/shared-types";

import { CreateExerciseDataForm } from "@/app/workouts/create/CreateExerciseDataForm";
import { WorkoutFormValues } from "@/types/form";

interface WorkoutFormProps {
  defaultValues: UpdateCompleteWorkoutData | CreateCompleteWorkoutData;
  mutate: (data: UpdateCompleteWorkoutData | CreateCompleteWorkoutData) => void;
  formId?: string;
}

export const WorkoutForm = ({
  defaultValues,
  mutate,
  formId,
}: WorkoutFormProps) => {
  const methods = useForm<UpdateCompleteWorkoutData>({
    defaultValues,
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

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
      code: "",
      sets: [
        {
          reps: "" as unknown as number,
          metric_value: "" as unknown as number,
        },
      ],
    });
  };

  const onSubmit = (data: WorkoutFormValues) => {
    mutate({ ...data });
  };
  return (
    <PageContainer display={"block"} padding={"xl"}>
      <SectionContainer>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} id={formId}>
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
                key={field.id}
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
            {!formId && (
              <FormButton loadingText="Saving workout..." type="submit">
                Save workout
              </FormButton>
            )}
          </form>
        </FormProvider>
      </SectionContainer>
    </PageContainer>
  );
};
