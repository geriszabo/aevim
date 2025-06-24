import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Target, Dumbbell, TrendingUp } from "lucide-react";

export const FeatureSection = () => {
  return (
     <section id="features" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Typography variant="heading" size="3xl" className="md:text-4xl">
              Built for Athletes
            </Typography>
            <Typography variant="muted" size="lg" className="mx-auto">
              Any workout. Any goal. Track what matters.
            </Typography>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cardList.map((item) => {
              return (
                <Card
                  key={item.title}
                  className="text-center border-0 shadow-sm"
                >
                  <CardHeader>
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
  )
}

const cardList = [
  {
    icon: <Target className="h-6 w-6 text-primary" />,
    title: "Log Workouts",
    description: "Fast workout creation. No wasted time.",
  },
  {
    icon: <Dumbbell className="h-6 w-6 text-primary" />,
    title: "Track Heavy",
    description: "Log weight, reps, time. Beat yesterday.",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: "See Progress",
    description: "Numbers don’t lie. Track your gains.",
  },
];