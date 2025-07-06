import { ContentContainer } from "@/components/layouts/ContentContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { EditWorkoutDialog } from "./EditWorkoutDialog";
import { EditWorkoutData } from "@/schemas/edit-workout-schema";

interface EditWorkoutSectionProps {
  editWorkoutData: EditWorkoutData;
}

export const EditWorkoutSection = ({
  editWorkoutData,
}: EditWorkoutSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { date, name, notes } = editWorkoutData;

  return (
    <SectionContainer padding="md">
      <ContentContainer>
        <Card className="shadow-lg w-full max-w-4xl mx-auto">
          <CardHeader className="flex justify-between align-super content-end">
            <CardTitle className="font-heading text-xl">
              Workout Details
            </CardTitle>
            {!isEditing && (
              <Pencil size={20} onClick={() => setIsEditing(true)} />
            )}
          </CardHeader>
          <CardContent>
            <Typography variant="body">{name}</Typography>
            <Typography variant="body">{date}</Typography>
            <Typography variant="body">
              {notes ?? "You didn't add notes"}
            </Typography>
          </CardContent>
        </Card>
      </ContentContainer>
      <EditWorkoutDialog
        {...editWorkoutData}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
      />
    </SectionContainer>
  );
};
