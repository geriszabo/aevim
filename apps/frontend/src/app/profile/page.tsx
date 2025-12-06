"use server";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import { getUserBiometrics } from "@/hooks/api/userBiometrics/getUserBiometrics";
import { UpdateProfilePage } from "./UpdateProfilePage";
import { UserMenu } from "./UserMenu";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  const { biometrics } = await queryClient.fetchQuery({
    queryKey: ["userBiometrics"],
    queryFn: () => getUserBiometrics(cookieStore.toString()),
  });

  return (
    <PageContainer display={"block"}>
      <ContentContainer className="flex justify-end">
        <UserMenu />
      </ContentContainer>
      <SectionContainer>
        <ContentContainer>
          <Card>
            <CardHeader>
              <Typography variant="heading">Biometrics</Typography>
            </CardHeader>
            <CardContent>
              {biometrics ? (
                Object.entries(biometrics).map(([bioKey, bioValue], index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex flex-row justify-between">
                      <Typography variant="body">{bioKey}</Typography>
                      <Typography variant="body">{bioValue}</Typography>
                    </div>
                  </div>
                ))
              ) : (
                <Typography variant="body">
                  No biometrics data available. Please add your biometrics
                  below.
                </Typography>
              )}
            </CardContent>
          </Card>
        </ContentContainer>
      </SectionContainer>
      <SectionContainer>
        <UpdateProfilePage biometrics={biometrics} />
      </SectionContainer>
    </PageContainer>
  );
}
