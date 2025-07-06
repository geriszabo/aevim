import { FormButton } from "@/components/Form/FormButton";
import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormTextareaField } from "@/components/Form/FormTextareaField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
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
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle />
              <Typography variant="heading" size="2xl">
                Edit workout
              </Typography>
              <DialogDescription>
                Update your training session
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
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
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <FormButton
                loadingText="Updating workout..."
                isLoading={isPending}
                disabled={isPending || !isValid}
                type="submit"
              >
                Update workout
              </FormButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
