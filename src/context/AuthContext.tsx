"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient, signOut as betterSignOut } from "@/lib/auth-client";

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
  loginAs: (role: UserRole) => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshSession: () => Promise<void>;
}

const mockUsers: Record<UserRole, User> = {
  customer: {
    id: "cust-01",
    name: "Alex Rahman",
    email: "alex@example.com",
    role: "customer",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  vendor: {
    id: "vend-01",
    name: "Luigi's Woodfired Pizzeria",
    email: "luigi@woodfired.com",
    role: "vendor",
    businessName: "Luigi's Woodfired Pizzeria",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80",
    subscriptionPlan: "premium",
  },
  admin: {
    id: "adm-01",
    name: "Sarah Admin",
    email: "admin@pizzahub.com",
    role: "admin",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = authClient.useSession();

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedUser = localStorage.getItem("pizzahub_demo_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Sync session with Better Auth when session changes
  useEffect(() => {
    if (session?.user) {
      const betterUser: User = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: ((session.user as any).role as UserRole) || "customer",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        businessName: (session.user as any).businessName || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subscriptionPlan: ((session.user as any).subscriptionPlan as "free" | "premium") || "free",
      };
      // Wrap in rAF to avoid synchronous setState inside effect
      window.requestAnimationFrame(() => {
        setUser(betterUser);
      });
    }
  }, [session]);

  const refreshSession = async () => {
    try {
      const res = await authClient.getSession();
      if (res?.data?.user) {
        setUser({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          image: res.data.user.image || undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: ((res.data.user as any).role as UserRole) || "customer",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          businessName: (res.data.user as any).businessName || undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subscriptionPlan: ((res.data.user as any).subscriptionPlan as "free" | "premium") || "free",
        });
      }
    } catch {
      // Ignore
    }
  };

  const loginAs = (role: UserRole) => {
    const selected = mockUsers[role];
    setUser(selected);
    try {
      localStorage.setItem("pizzahub_demo_user", JSON.stringify(selected));
    } catch {
      // Ignore
    }
  };

  const logout = async () => {
    try {
      await betterSignOut();
    } catch {
      // Ignore
    }
    setUser(null);
    try {
      localStorage.removeItem("pizzahub_demo_user");
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loginAs,
        logout,
        setUser,
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
