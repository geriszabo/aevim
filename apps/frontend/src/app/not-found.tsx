"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo/Logo";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-lg w-full mx-auto">
        <Logo text="404" size="8xl" />

        <div className="space-y-4 mb-8 text-center">
          <Typography variant="heading" size="3xl" className="mb-2">
            Page Not Found
          </Typography>
          <Typography variant="body" size="md" className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist.
          </Typography>
        </div>

        <Button
          onClick={handleGoDashboard}
          className="w-full h-12 text-base font-bold font-heading"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          GO TO DASHBOARD
        </Button>

        <div className="space-y-2 text-center">
          <Typography variant="muted" size="sm">
            Still lost?
          </Typography>
          <Typography variant="muted" size="sm">
            Check the URL or start a new workout session.
          </Typography>
        </div>
      </div>
      <div id="toBottom" className="mt-auto pt-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo size="lg" />
        </div>
        <Typography variant="muted" size="xs">
          Log with power, train with purpose
        </Typography>
      </div>
    </div>
  );
}
