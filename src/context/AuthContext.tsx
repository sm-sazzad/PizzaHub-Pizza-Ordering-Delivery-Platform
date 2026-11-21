"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient, signOut } from "@/lib/auth-client";
import { useToast } from "@/context/ToastContext";

export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  businessName?: string;
  subscriptionPlan?: "free" | "premium";
  isBlocked?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const toast = useToast();

  const { data: session, isPending, refetch } = authClient.useSession();

  // Check URL for OAuth login/signup redirect parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "success") {
        toast.success("Welcome back! Signed in with Google.", "Sign In Successful");
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("signup") === "success") {
        toast.success("Account created successfully with Google!", "Registration Complete");
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [toast]);

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || undefined,
        role:
          ((session.user as unknown as Record<string, unknown>)
            .role as UserRole) || "customer",
        businessName: (session.user as unknown as Record<string, unknown>)
          .businessName as string | undefined,
        subscriptionPlan:
          ((session.user as unknown as Record<string, unknown>)
            .subscriptionPlan as "free" | "premium") || "free",
        isBlocked: Boolean(
          (session.user as unknown as Record<string, unknown>).isBlocked,
        ),
      }
    : null;

  const logout = async () => {
    try {
      await signOut();
      toast.success("You have been signed out.", "Signed Out");
    } catch (err) {
      console.error("Sign out error:", err);
    }
    router.push("/signin");
  };

  const refreshSession = async () => {
    try {
      await authClient.getSession({ query: { disableCookieCache: true } });
      await refetch();
    } catch (err) {
      console.error("Session refresh error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading: isPending,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
