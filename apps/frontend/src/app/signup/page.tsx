"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo/Logo";
import { useRouter } from "next/navigation";
import { SignupCard } from "./SignupCard";
import { PageContainer } from "@/components/layouts/PageContainer";

export default function SignupPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Log with power, train with purpose
          </p>
        </div>
        <SignupCard />
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
