"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import Link from "next/link";

export const StartNewWorkout = async () => {
  return (
    <Card>
      <CardHeader>
        <Typography variant="heading">Quick start</Typography>
      </CardHeader>
      <CardContent className=" space-y-4">
        <Button size="sm">
          <Link
            href="/workouts/create"
            className="flex items-center justify-center w-full"
          >
            <Plus className="mr-2 h-5 w-5" />
            <Typography variant="body">START NEW WORKOUT</Typography>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
