"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { postLogout } from "@/hooks/api/auth/postLogout";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toSentenceCase } from "@/lib/utils";

export const UserMenu = () => {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  console.log(theme);

  async function handleLogout() {
    try {
      const res = await postLogout();
      if (res.ok) {
        await res.json();
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const nextTheme = theme === "light" ? "dark" : "light";
  function handleThemeChange() {
    setTheme(nextTheme);
  }

  const userMenuItems = [
    { label: toSentenceCase(nextTheme), action: handleThemeChange },
    { label: "Logout", action: handleLogout },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userMenuItems.map((item) => (
          <DropdownMenuItem key={item.label} onClick={item.action}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
