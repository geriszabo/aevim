import { ContentContainer } from "@/components/layouts/ContentContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Typography } from "@/components/ui/typography";
import { Check } from "lucide-react";

export const MindsetSection = () => {
  return (
    <SectionContainer>
      <ContentContainer className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Typography variant="heading" size="3xl" className="md:text-4xl">
            No Excuses
          </Typography>
          <Typography variant="muted" size="lg">
            Built for serious lifters who want results, not distractions.
          </Typography>
        </div>
        <div className="grid md:grid-cols-3 gap-8 space-y-6">
          {list.map((item) => {
            return (
              <div key={item.bulletPoint} className="flex gap-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-500 mt-1" />
                </div>
                <div>
                  <Typography variant="body" className="font-semibold mb-2">
                    {item.bulletPoint}
                  </Typography>
                  <Typography variant="muted">{item.muted}</Typography>
                </div>
              </div>
            );
          })}
        </div>
      </ContentContainer>
    </SectionContainer>
  );
};

const list = [
  {
    bulletPoint: "Zero Fluff",
    muted: "Log your lifts. Track your progress. That's it.",
  },
  {
    bulletPoint: "Gym Ready",
    muted: "Built for the gym floor. Fast input, clear display.",
  },
  {
    bulletPoint: "Your Numbers",
    muted: "Your workouts, your data, your gains.",
  },
];
