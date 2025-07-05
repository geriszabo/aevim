"use client";

import React from "react";

import { LoginCard } from "./LoginCard";
import { AuthPageLayout } from "@/components/layouts/AuthPageLayout";

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginCard />
    </AuthPageLayout>
  );
}
