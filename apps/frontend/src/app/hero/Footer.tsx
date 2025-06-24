import { Logo } from "@/components/Logo/Logo";
import { Typography } from "@/components/ui/typography";
import React from "react";

export const Footer = () => {
  return (
    <footer className="py-8 border-t bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Logo size="lg" />
        </div>
        <Typography variant="muted" size="sm">
          Log with power, train with purpose.
        </Typography>
      </div>
    </footer>
  );
};
