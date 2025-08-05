import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import { WorkoutData } from "@aevim/shared-types/schemas/workout-schema";
import { UseFormRegister, Control, FieldErrors } from "react-hook-form";

interface CreateWorkoutDataFormProps {
  register: UseFormRegister<WorkoutData>;
  control: Control<WorkoutData>;
  errors: FieldErrors<WorkoutData>;
}

export const CreateWorkoutDataForm = ({
  control,
  errors,
  register,
}: CreateWorkoutDataFormProps) => {
  return (
    <>
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
    </>
  );
};
