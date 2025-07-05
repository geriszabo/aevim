"use client";

import { ContentContainer } from "@/components/layouts/ContentContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <SectionContainer padding="xl">
      <ContentContainer maxWidth="md" textAlign="center">
        <Typography variant="hero" size="4xl" className="md:text-6xl">
          Log with Power,
          <br />
          Train with Purpose
        </Typography>
        <Typography variant="muted" size="xl" className="md:text-2xl">
          No fluff. No excuses. Just results.
        </Typography>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() =>
              document
                .getElementById("auth")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Logging
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </ContentContainer>
    </SectionContainer>
  );
};
