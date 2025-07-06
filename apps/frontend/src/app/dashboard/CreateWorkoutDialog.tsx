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
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle />
              <Typography variant="heading" size="2xl">
                Create workout
              </Typography>
              <DialogDescription>
                Log your next training session
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
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <FormButton
                loadingText="Creating workout..."
                isLoading={isPending}
                disabled={isPending || !isValid}
                type="submit"
              >
                Create workout
              </FormButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
