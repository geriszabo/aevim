"use client";

import { useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Logo } from "../Logo/Logo";
import { Typography } from "../ui/typography";

export default function BottomNavBar() {
  const router = useRouter();
  const pathName = usePathname();
  const currentTab = tabs.find((tab) => tab.routeTo === pathName);

  const [activeTab, setActiveTab] = useState<
    (typeof tabs)[number]["value"] | undefined
  >(currentTab?.value);

  const handleOnTabChange = (tab: {
    value: (typeof tabs)[number]["value"];
    routeTo: string;
  }) => {
    setActiveTab(tab.value);
    router.push(tab.routeTo);
  };

  return (
    <div className="w-full h-14 bg-background dark:bg-black flex justify-around align-middle fixed bottom-0">
      {tabs.map((tab) => (
        <Button
          className="h-14"
          key={tab.value}
          variant="ghost"
          onClick={() => handleOnTabChange(tab)}
        >
          {tab.value === activeTab ? (
            <Logo text={tab.name} size="lg" />
          ) : (
            <Typography variant="heading" size="md">
              {tab.name}
            </Typography>
          )}
        </Button>
      ))}
    </div>
  );
}

const tabs = [
  {
    value: "home",
    name: "Home",
    routeTo: "/dashboard",
  },
  {
    value: "workouts",
    name: "Workouts",
    routeTo: "/workouts",
  },
  {
    value: "statistics",
    name: "Statistics",
    routeTo: "/stats",
  },
  {
    value: "profile",
    name: "Profile",
    routeTo: "/profile",
  },
] as const;
