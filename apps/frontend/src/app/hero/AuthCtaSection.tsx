"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const AuthCtaSection = () => {
  const router = useRouter();
  return (
    <section id="auth" className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
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
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <Typography
                      variant="muted"
                      size="xs"
                      className="uppercase px-2 bg-white"
                    >
                      Already lifting?
                    </Typography>
                  </div>
                </div>
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
        </div>
      </div>
    </section>
  );
};
