import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteWorkout } from "@/hooks/workouts/useDeleteWorkout";
import { useRouter } from "next/navigation";

interface DeleteWorkoutDialogProps {
  workoutId: string;
}

export function DeleteWorkoutDialog({ workoutId }: DeleteWorkoutDialogProps) {
  const router = useRouter();
  const { mutate, isPending } = useDeleteWorkout(workoutId);

  const handleDelete = () => {
    mutate();
    router.push("/dashboard");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full h-12 text-base font-bold font-heading uppercase"
        >
          Delete workout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            workout and its exercises.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white font-heading"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current uppercase" />
                Deleteing workout...
              </>
            ) : (
              "Delete workout"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
