"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Typography } from "@/components/ui/typography";

import {
  UpdateCompleteWorkoutData,
  CompleteWorkout,
} from "@aevim/shared-types";
import { useState } from "react";
import { useUpdateCompleteWorkout } from "@/hooks/completeWorkouts/useUpdateCompleteWorkout";
import { WorkoutForm } from "@/components/Form/WorkoutForm";

interface UpdateWorkout {
  completeWorkout: CompleteWorkout;
}

export const UpdateWorkout = ({ completeWorkout }: UpdateWorkout) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { mutate, isPending } = useUpdateCompleteWorkout(
    completeWorkout.workout.id,
  );

  const handleUpdate = (data: UpdateCompleteWorkoutData) => {
    mutate(data, {
      onSuccess: () => (router.refresh(), setIsDrawerOpen(false)),
    });
  };

  const formId = "update-workout-form";

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger className="w-full" asChild>
        <Button className="w-full p-6">
          <Typography
            size="xl"
            variant="heading"
            onClick={() => setIsDrawerOpen(true)}
          >
            Update workout
          </Typography>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Update workout</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <WorkoutForm
            defaultValues={completeWorkout}
            mutate={handleUpdate}
            formId={formId}
          />
        </div>
        <DrawerFooter>
          <Button type="submit" form={formId} disabled={isPending}>
            <Typography variant="heading" size="md">
              {isPending ? "Loading..." : "Submit"}
            </Typography>
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
