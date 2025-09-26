import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Logo } from "@/components/Logo/Logo";
import { DeleteWorkoutDialog } from "./DeleteWorkoutDialog";
import { Completeworkout } from "./Completeworkout";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const workoutId = (await params).id;

  return (
    <PageContainer display={"block"}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <ContentContainer className="py-4">
          <Logo size="2xl" routeToDashboard />
        </ContentContainer>
      </header>

      <Completeworkout workoutId={workoutId} />
      <div className="flex flex-col gap-2">
        <DeleteWorkoutDialog workoutId={workoutId} />
      </div>
    </PageContainer>
  );
}
