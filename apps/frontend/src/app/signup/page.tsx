"use client";

import React from "react";
import { SignupCard } from "./SignupCard";
import { AuthPageLayout } from "@/components/layouts/AuthPageLayout";

export default function SignupPage() {
  return (
    <AuthPageLayout>
      <SignupCard />
    </AuthPageLayout>
  );
}
