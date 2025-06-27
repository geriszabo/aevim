"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo/Logo";
import { LoginCard } from "./LoginCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo/>
          <p className="text-sm text-muted-foreground">
            Log with power, train with purpose
          </p>
        </div>
        <LoginCard />
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
