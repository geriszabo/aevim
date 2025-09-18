"use client";
import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Logo } from "@/components/Logo/Logo";
import { Typography } from "@/components/ui/typography";
import { useGetUserBiometrics } from "@/hooks/userBiometrics/useGetUserBiometrics";
import { UserBiometricsForm } from "./UserBiometricsForm";
import { useMemo } from "react";
import { UserBiometrics } from "@aevim/shared-types";

export default function ProfilePage() {
  const { data, isLoading } = useGetUserBiometrics();

  const biometrics = data?.biometrics;
  const hasExistingData = !!biometrics;

  const defaultValues = useMemo(() => {
    return {
      build: (biometrics?.build ?? "") as UserBiometrics["build"],
      height: (biometrics?.height ?? "") as unknown as UserBiometrics["height"],
      sex: (biometrics?.sex ?? "") as UserBiometrics["sex"],
      weight: (biometrics?.weight ?? "") as unknown as UserBiometrics["weight"],
    };
  }, [biometrics]);

  if (isLoading) {
    return (
      <PageContainer display={"block"}>
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
          <ContentContainer className="py-4">
            <Logo size="2xl" routeToDashboard />
          </ContentContainer>
        </header>
        <SectionContainer>
          <ContentContainer>
            <div className="flex justify-center items-center h-64">
              <Typography variant="heading">Loading profile...</Typography>
            </div>
          </ContentContainer>
        </SectionContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer display={"block"}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <ContentContainer className="py-4">
          <Logo size="2xl" routeToDashboard />
        </ContentContainer>
      </header>
      <SectionContainer>
        <ContentContainer>
          <UserBiometricsForm
            defaultValues={defaultValues}
            isUpdateForm={hasExistingData}
          />
        </ContentContainer>
      </SectionContainer>
    </PageContainer>
  );
}
