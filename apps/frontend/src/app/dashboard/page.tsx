"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import {
  Dumbbell,
  Plus,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  MoreHorizontal,
  Play,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Logo } from "@/components/Logo/Logo";
import env from "@/env";
import { useAuth } from "@/contexts/AuthContext";
import { postLogout } from "@/hooks/api/postLogout";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [activeWorkout, setActiveWorkout] = useState(null);

  const router = useRouter()

  const {user} = useAuth()
  console.log(user)

  // Mock data
  const recentWorkouts = [
    {
      id: 1,
      name: "Push Day",
      date: "Today",
      duration: "45 min",
      exercises: 5,
      status: "completed",
    },
    {
      id: 2,
      name: "Pull Day",
      date: "Yesterday",
      duration: "52 min",
      exercises: 6,
      status: "completed",
    },
    {
      id: 3,
      name: "Leg Day",
      date: "2 days ago",
      duration: "38 min",
      exercises: 4,
      status: "completed",
    },
  ];

  const workoutTemplates = [
    {
      id: 1,
      name: "Push Day",
      exercises: 5,
      lastUsed: "Today",
    },
    {
      id: 2,
      name: "Pull Day",
      exercises: 6,
      lastUsed: "2 days ago",
    },
    {
      id: 3,
      name: "Leg Day",
      exercises: 4,
      lastUsed: "4 days ago",
    },
  ];

  const stats = {
    weeklyWorkouts: 4,
    totalWorkouts: 127,
    currentStreak: 6,
  };

  const handleStartWorkout = (template) => {
    setActiveWorkout(template);
    // Navigate to workout session
    console.log("Starting workout:", template.name);
  };

  const handleLogout = async () => {
  try {
      const res = await postLogout()
      if (res.ok) {
        await res.json();
        router.push("/")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTestWorkoutOverview = async () => {
    console.log(env.API_BASE_URL + "/auth/me");
    try {
      const res = await fetch(env.API_BASE_URL + "/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer display="block">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="2xl" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <Typography variant="heading" size="3xl" className="mb-2">
            Ready to Log?
          </Typography>
          <Typography variant="muted">
            Time to crush your next session
          </Typography>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <Typography variant="body" size="2xl" className="text-primary">
              {stats.weeklyWorkouts}
            </Typography>
            <Typography variant="muted" size="xs">
              This Week
            </Typography>
          </Card>

          <Card className="text-center p-4">
            <Typography variant="body" size="2xl" className="text-primary">
              {stats.currentStreak}
            </Typography>
            <Typography variant="muted" size="xs">
              Day Streak
            </Typography>
          </Card>

          <Card className="text-center p-4">
            <Typography variant="body" size="2xl" className="text-primary">
              {stats.totalWorkouts}
            </Typography>
            <Typography variant="muted" size="xs">
              Total
            </Typography>
          </Card>
        </div>

        {/* Quick Start */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <Typography variant="body" size="xl" className="mb-4">
              Start Workout
            </Typography>

            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold font-heading"
              onClick={handleTestWorkoutOverview}
            >
              <Play className="mr-2 h-5 w-5" />
              QUICK START
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <Typography
                  variant="muted"
                  size="xs"
                  className="bg-white dark:bg-slate-900 px-2 uppercase"
                >
                  or choose template
                </Typography>
              </div>
            </div>
          </div>
        </Card>

        {/* Workout Templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="body" size="lg">
              Your Workouts
            </Typography>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>

          <div className="space-y-3">
            {workoutTemplates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Typography variant="body" size="md" className="mb-1">
                      {template.name}
                    </Typography>
                    <Typography variant="muted" size="sm">
                      {template.exercises} exercises • {template.lastUsed}
                    </Typography>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStartWorkout(template)}
                      className="h-10 px-4 font-semibold"
                    >
                      START
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div>
          <Typography variant="body" size="lg" className="mb-4">
            Recent Sessions
          </Typography>

          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <Card key={workout.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-green-500" />
                    </div>

                    <div>
                      <Typography variant="body" size="md" className="mb-1">
                        {workout.name}
                      </Typography>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{workout.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{workout.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{workout.exercises} exercises</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom spacing for mobile navigation */}
        <div className="h-20"></div>
      </main>
    </PageContainer>
  );
}
