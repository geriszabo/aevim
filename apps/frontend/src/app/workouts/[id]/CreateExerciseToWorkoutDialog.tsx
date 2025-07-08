import { FormDialog } from "@/components/Form/FormDialog";
import { FormInputField } from "@/components/Form/FormInputField";
import { useCreateExerciseToWorkout } from "@/hooks/exercises/useCreateExerciseToWorkout";
import {
  CreateExerciseData,
  createExerciseSchema,
} from "@/schemas/create-exercise-schema";
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
  } = useForm<CreateExerciseData>({
    resolver: standardSchemaResolver(createExerciseSchema),
    mode: "onChange",
    defaultValues: {
      category: "",
      name: "",
    },
  });

  const onSubmit = (data: CreateExerciseData) => {
    mutate(data);
    handleClose()
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
    </FormDialog>
  );
};
