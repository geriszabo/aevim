"use client";

import { FormDividerText } from "@/components/Form/FormDividerText";
import { ContentContainer } from "@/components/layouts/ContentContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const AuthCtaSection = () => {
  const router = useRouter();

  return (
    <SectionContainer id="auth" background="white">
      <ContentContainer maxWidth="sm" textAlign="center">
        <div className="mb-8">
          <Typography variant="hero" size="3xl" className="mb-4">
            Stop Talking. Start tracking.
          </Typography>
          <Typography variant="muted" size="lg">
            Every rep counts. Every set matters. Make them count.
          </Typography>
        </div>
        <Card className="p-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full text-lg py-6 font-bold font-heading"
                onClick={() => router.push("/signup")}
              >
                START LOGGING
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <FormDividerText text="Already lifting?" />

              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg py-6"
                onClick={() => router.push("/login")}
              >
                LOG IN
              </Button>
            </div>
            <div className="text-center">
              <Typography variant="muted" size="sm">
                Free • Fast • No excuses
              </Typography>
            </div>
          </div>
        </Card>
      </ContentContainer>
    </SectionContainer>
  );
};
