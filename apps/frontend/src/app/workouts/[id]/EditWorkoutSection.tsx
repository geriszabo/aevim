import { ContentContainer } from "@/components/layouts/ContentContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Pencil } from "lucide-react";
import { EditWorkoutData } from "@/schemas/edit-workout-schema";
import { useRouter } from "next/navigation";

interface EditWorkoutSectionProps {
  editWorkoutData: EditWorkoutData;
  workoutId: string;
}

export const EditWorkoutSection = ({
  editWorkoutData,
  workoutId,
}: EditWorkoutSectionProps) => {
  const { date, name, notes } = editWorkoutData;
  const router = useRouter();
  const workoutDetails = [
    { label: "name", value: name },
    { label: "date", value: date },
    { label: "notes", value: notes ?? "No notes added" },
  ];
  return (
    <SectionContainer padding="sm">
      <ContentContainer>
        <Card className="shadow-md max-w-4xl mx-auto">
          <CardHeader className="flex justify-between align-super content-end">
            <CardTitle className="font-heading text-xl">
              Workout Details
            </CardTitle>
            <Pencil
              size={20}
              onClick={() => router.push(`/workouts/update/${workoutId}`)}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {workoutDetails.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-2"
                >
                  <Typography
                    variant="body"
                    size="sm"
                    className="font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body"
                    className="font-medium line-clamp-3 text-right"
                  >
                    {value}
                  </Typography>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ContentContainer>
    </SectionContainer>
  );
};
