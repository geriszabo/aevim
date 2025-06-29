"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo/Logo";
import { LoginCard } from "./LoginCard";
import { PageContainer } from "@/components/layouts/PageContainer";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter()
  return (
    <PageContainer
      alignItems="center"
      justifyContent="center"
      padding="md"
      spacing="none"
    >
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
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
