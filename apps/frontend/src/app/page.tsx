"use client";

import React from "react";
import { Footer } from "./hero/Footer";
import { Header } from "./hero/Header";
import { HeroSection } from "./hero/HeroSection";
import { FeatureSection } from "./hero/FeatureSection";
import { MindsetSection } from "./hero/MindsetSection";
import { AuthCtaSection } from "./hero/AuthCtaSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <HeroSection />
      <FeatureSection />
      <MindsetSection />
      <AuthCtaSection />
      <Footer />
    </div>
  );
}
