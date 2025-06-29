
import React from "react";
import { Footer } from "./hero/Footer";
import { Header } from "./hero/Header";
import { HeroSection } from "./hero/HeroSection";
import { FeatureSection } from "./hero/FeatureSection";
import { MindsetSection } from "./hero/MindsetSection";
import { AuthCtaSection } from "./hero/AuthCtaSection";
import { PageContainer } from "@/components/layouts/PageContainer";

export default function Home() {
  return (
    <PageContainer display="block">
      <Header />
      <HeroSection />
      <FeatureSection />
      <MindsetSection />
      <AuthCtaSection />
      <Footer />
    </PageContainer>
  );
}
