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
import { postWorkout } from "@/hooks/api/postWorkout";
import {
  CreateWorkoutData,
  createWorkoutSchema,
} from "@/schemas/create-workout-schema";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

interface CreateWorkoutDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateWorkoutDialog = ({
  isOpen,
  setIsOpen,
}: CreateWorkoutDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
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
    setIsLoading(true);
    const { date, name, notes } = data;
    try {
      const res = await postWorkout({ date, name, notes });
      if (res.ok) {
        const { message, workout } = await res.json();
        toast.success(message);
        console.log(workout);
        router.push(`/workouts/${workout.id}`)
      } else {
        const { errors } = await res.json();
        toast.error(errors);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
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
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full h-12 text-base font-heading"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                    Creating workout...
                  </div>
                ) : (
                  "Create workout"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster position="top-center" richColors />
    </>
  );
};
