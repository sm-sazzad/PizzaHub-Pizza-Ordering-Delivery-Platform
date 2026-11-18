"use client";

import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { authClient, signOut } from "@/lib/auth-client";

export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  businessName?: string;
  subscriptionPlan?: "free" | "premium";
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

  const { data: session, isPending } = authClient.useSession();

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
      }
    : null;

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    router.push("/signin");
  };

  const refreshSession = async () => {
    try {
      await authClient.getSession();
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
