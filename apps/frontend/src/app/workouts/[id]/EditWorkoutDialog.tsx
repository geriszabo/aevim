import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import { FormDialog } from "@/components/Form/FormDialog";
import { useUpdateWorkout } from "@/hooks/workouts/useUpdateWorkout";
import {
  EditWorkoutData,
  editWorkoutSchema,
} from "@/schemas/edit-workout-schema";
import { WorkoutWithoutUserId } from "@aevim/shared-types";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

interface EditWorkoutDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  date?: WorkoutWithoutUserId["date"];
  name?: WorkoutWithoutUserId["name"];
  notes?: WorkoutWithoutUserId["notes"];
  workoutId: string;
}

export const EditWorkoutDialog = ({
  isOpen,
  setIsOpen,
  date,
  name,
  notes,
  workoutId,
}: EditWorkoutDialogProps) => {
  const { mutate, isPending } = useUpdateWorkout(workoutId);
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    reset,
    control,
  } = useForm<EditWorkoutData>({
    resolver: standardSchemaResolver(editWorkoutSchema),
    mode: "onChange",
    defaultValues: {
      date,
      name,
      notes,
    },
  });

  const onSubmit = async (data: EditWorkoutData) => {
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
      setIsOpen={setIsOpen}
      title="Edit workout"
      description="Update your training session"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
      isPending={isPending}
      isValid={isValid}
      submitButtonText="Update workout"
      loadingText="Updating workout..."
    >
      <FormInputField
        id="name"
        label="Workout name"
        register={register}
        type="text"
        error={errors.name}
        placeholder={name}
      />
      <FormDatePicker
        id="date"
        label="Date"
        control={control}
        error={errors.date}
        placeholder={date}
      />
      <FormTextareaField
        id="notes"
        label="Notes for the workout"
        error={errors.notes}
        placeholder={notes ?? "You didn't add notes yet"}
        register={register}
      />
    </FormDialog>
  );
};