"use client";

import React, { createContext, useContext, useState } from "react";

export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  subscriptionPlan?: "free" | "premium";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const mockUsers: Record<UserRole, User> = {
  customer: {
    id: "cust-01",
    name: "Alex Rahman",
    email: "alex@example.com",
    role: "customer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  vendor: {
    id: "vend-01",
    name: "Luigi's Woodfired Pizzeria",
    email: "luigi@woodfired.com",
    role: "vendor",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80",
    subscriptionPlan: "premium",
  },
  admin: {
    id: "adm-01",
    name: "Sarah Admin",
    email: "admin@pizzahub.com",
    role: "admin",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read persisted user safely using lazy state initializer (React 19 compliant)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedUser = localStorage.getItem("pizzahub_demo_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const loginAs = (role: UserRole) => {
    const selected = mockUsers[role];
    setUser(selected);
    try {
      localStorage.setItem("pizzahub_demo_user", JSON.stringify(selected));
    } catch {
      // Ignore
    }
  };

  const logout = () => {
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
