"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import env from "@/env";

interface User {
  id: string;
  email: string;
  username: string
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!user

  // Fetch user data from your /auth/me endpoint
  const fetchUser = async () => {
    try {
      const response = await fetch(`${env.API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${env.API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fetch user data when component mounts (only on protected pages)
  useEffect(() => {
    // Check if we're on a protected route where we need user data
    const protectedPaths = ["/dashboard", "/profile", "/workouts", "/exercises"];
    const isProtectedPath = protectedPaths.some((path) =>
      window.location.pathname.startsWith(path)
    );

    if (isProtectedPath) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, fetchUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth anywhere in your app
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}