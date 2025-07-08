import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import { FormDialog } from "@/components/Form/FormDialog";
import { useCreateWorkout } from "@/hooks/workouts/useCreateWorkout";
import {
  CreateWorkoutData,
  createWorkoutSchema,
} from "@/schemas/create-workout-schema";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

interface CreateWorkoutDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateWorkoutDialog = ({
  isOpen,
  setIsOpen,
}: CreateWorkoutDialogProps) => {
  const { mutate, isPending } = useCreateWorkout();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    reset,
    control,
  } = useForm<CreateWorkoutData>({
    resolver: standardSchemaResolver(createWorkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      date: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CreateWorkoutData) => {
    mutate({ ...data });
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <FormDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create workout"
      description="Log your next training session"
      onSubmit={handleSubmit(onSubmit)}
      onClose={handleClose}
      isPending={isPending}
      isValid={isValid}
      submitButtonText="Create workout"
      loadingText="Creating workout..."
    >
      <FormInputField
        id="name"
        label="Workout name"
        register={register}
        type="text"
        error={errors.name}
        placeholder="Gym session"
      />
      <FormDatePicker
        id="date"
        label="Date"
        control={control}
        error={errors.date}
        placeholder="Select workout date"
      />
      <FormTextareaField
        id="notes"
        label="Notes for the workout"
        error={errors.notes}
        placeholder="Heavy session, saw a hot girl doing lifts"
        register={register}
      />
    </FormDialog>
  );
};
