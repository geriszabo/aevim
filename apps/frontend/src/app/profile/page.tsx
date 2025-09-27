"use client";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Logo } from "@/components/Logo/Logo";
import { UserBiometricsForm } from "./UserBiometricsForm";
import { Suspense } from "react";
import { ProfilePageSkeleton } from "./ProfilePageSkeleton";

export default function ProfilePage() {
  return (
    <PageContainer display={"block"}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <ContentContainer className="py-4">
          <Logo size="2xl" routeToDashboard />
        </ContentContainer>
      </header>
      <SectionContainer>
        <ContentContainer>
          <Suspense fallback={<ProfilePageSkeleton />}>
            <UserBiometricsForm />
          </Suspense>
        </ContentContainer>
      </SectionContainer>
    </PageContainer>
  );
}
