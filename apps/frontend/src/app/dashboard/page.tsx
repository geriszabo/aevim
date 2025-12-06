import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { PageContainer } from "@/components/layouts/PageContainer";
import { RecentWorkoutsCard } from "./RecentWorkoutsCard";
import { QueryClient } from "@tanstack/react-query";
import { getWorkouts } from "@/hooks/api/workouts/getWorkouts";
import { cookies } from "next/headers";
import DashboardHeaderSection from "./DashboardHeaderSection";
import Link from "next/link";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  const { workouts: recentWorkouts } = await queryClient.fetchQuery({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(cookieStore.toString(), { limit: 5 }),
  });

  return (
    <PageContainer display="block">
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center">
          <DashboardHeaderSection />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card className="text-center p-4" key={stat.label}>
              <Typography variant="body" size="2xl" className="text-primary">
                {stat.amount}
              </Typography>
              <Typography variant="muted" size="xs">
                {stat.label}
              </Typography>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="text-center space-y-4">
            <Typography variant="body" size="xl" className="mb-4">
              Start Workout
            </Typography>
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold font-heading"
            >
              <Play className="mr-2 h-5 w-5" />
              <Link href="/workouts/create">QUICK START</Link>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <Typography
                  variant="muted"
                  size="xs"
                  className="bg-card px-2 uppercase"
                >
                  or choose template
                </Typography>
              </div>
            </div>
          </div>
        </Card>
        <div>
          <Typography variant="body" size="lg" className="mb-4">
            Recent Sessions
          </Typography>

          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <RecentWorkoutsCard {...workout} key={workout.id} />
            ))}
          </div>
        </div>
        <div className="h-20"></div>
      </main>
    </PageContainer>
  );
}

const stats = [
  { amount: 4, label: "This week" },
  { amount: 127, label: "Day streek" },
  { amount: 6, label: "Total" },
];
