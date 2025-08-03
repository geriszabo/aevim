import { FormDialog } from "@/components/Form/FormDialog";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import { useCreateExerciseToWorkout } from "@/hooks/exercises/useCreateExerciseToWorkout";
import {
  ExerciseData,
  exerciseSchema,
} from "@aevim/shared-types/exercise-schema";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

interface CreateExerciseToWorkoutDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  workoutId: string;
}

export const CreateExerciseToWorkoutDialog = ({
  isOpen,
  setIsOpen,
  workoutId,
}: CreateExerciseToWorkoutDialogProps) => {
  const { mutate, isPending } = useCreateExerciseToWorkout(workoutId);
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    reset,
  } = useForm<ExerciseData>({
    resolver: standardSchemaResolver(exerciseSchema),
    mode: "onChange",
    defaultValues: {
      category: "",
      name: "",
      notes: "",
    },
  });

  const onSubmit = (data: ExerciseData) => {
    mutate(data);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <FormDialog
      isOpen={isOpen}
      title="Create exercise"
      description="Log your next exercise"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
      loadingText="Creating exercise..."
      submitButtonText="Create exercise"
      setIsOpen={setIsOpen}
      isPending={isPending}
      isValid={isValid}
    >
      <FormInputField
        id="name"
        label="Exercise name"
        type="text"
        register={register}
        placeholder="Pull ups"
        error={errors.name}
      />
      <FormInputField
        id="category"
        label="Exercise category"
        type="text"
        register={register}
        placeholder="cardio"
        error={errors.category}
      />
      <FormTextareaField
        id="notes"
        label="Notes"
        register={register}
        placeholder="Was"
        error={errors.notes}
      />
    </FormDialog>
  );
};
