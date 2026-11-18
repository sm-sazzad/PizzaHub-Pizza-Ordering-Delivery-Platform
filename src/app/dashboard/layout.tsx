"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DashboardIcon,
  PizzaIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
  SparklesIcon,
  StoreIcon,
  UserIcon,
} from "@/components/ui/Icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoggedIn, logout, loginAs } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Vendor navigation links (from Assignment 9 PDF Page 4 & 7)
  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: DashboardIcon,
    },
    {
      name: "Add Menu Item",
      href: "/dashboard/add-item",
      icon: PlusCircleIcon,
    },
    {
      name: "My Menu Items",
      href: "/dashboard/menu",
      icon: PizzaIcon,
    },
    {
      name: "Customer Orders",
      href: "/dashboard/vendor-orders",
      icon: ShoppingBagIcon,
    },
    {
      name: "Subscription",
      href: "/dashboard/subscription",
      icon: CreditCardIcon,
    },
    {
      name: "Profile Settings",
      href: "/profile",
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFBF7] dark:bg-[#100E0D] text-[#1C1917] dark:text-[#F5F3F0]">
      {/* Mobile Top Header for Dashboard */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white">
            <StoreIcon size={16} />
          </div>
          <div>
            <span className="font-heading text-sm font-bold block text-stone-900 dark:text-white">
              Vendor Portal
            </span>
            <span className="text-[10px] text-stone-400 capitalize">
              {user?.businessName || user?.name || "Luigi's Pizzeria"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          aria-label="Toggle navigation sidebar"
        >
          {mobileSidebarOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Slide-Out */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-72 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-stone-100 dark:border-stone-800">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-red-500/25">
                <PizzaIcon size={20} className="text-white" />
              </div>
              <div>
                <span className="font-heading text-xl font-bold tracking-tight text-stone-900 dark:text-white block">
                  Pizza<span className="text-red-600">Hub</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 block">
                  Vendor Dashboard
                </span>
              </div>
            </Link>

            {/* Quick Demo Switcher if logged in as customer or guest */}
            {(!isLoggedIn || user?.role !== "vendor") && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold flex items-center gap-1">
                    <SparklesIcon size={12} />
                    <span>Vendor Mode Required</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => loginAs("vendor")}
                  className="w-full mt-1 py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm transition-colors text-center"
                >
                  Switch to Vendor Account
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-red-600" : "text-stone-400"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Summary at bottom of Sidebar */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 ring-2 ring-red-500/20 shrink-0">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-600 font-bold">
                  <UserIcon size={18} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                {user?.businessName || user?.name || "Luigi's Pizzeria"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  {user?.role || "vendor"}
                </span>
                {user?.subscriptionPlan === "premium" && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-500 to-amber-500 text-white">
                    PRO
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-red-600 hover:border-red-500/30 text-xs font-semibold transition-colors"
          >
            <LogOutIcon size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
