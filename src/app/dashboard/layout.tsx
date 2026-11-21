"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
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
  StoreIcon,
  UserIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface RoleLayoutConfig {
  title: string;
  roleLabel: string;
  badgeStyle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  navItems: NavItem[];
}

const ROLE_CONFIGS: Record<UserRole, RoleLayoutConfig> = {
  customer: {
    title: "Customer Portal",
    roleLabel: "Customer",
    badgeStyle:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: UserIcon,
    navItems: [
      {
        name: "Overview",
        href: "/dashboard",
        icon: DashboardIcon,
      },
      {
        name: "My Orders",
        href: "/dashboard/my-orders",
        icon: ShoppingBagIcon,
      },
      {
        name: "Browse Menu",
        href: "/menu",
        icon: PizzaIcon,
      },
      {
        name: "Profile Settings",
        href: "/profile",
        icon: SettingsIcon,
      },
    ],
  },
  vendor: {
    title: "Vendor Portal",
    roleLabel: "Vendor",
    badgeStyle:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: StoreIcon,
    navItems: [
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
    ],
  },
  admin: {
    title: "Admin Console",
    roleLabel: "Administrator",
    badgeStyle:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: ShieldCheckIcon,
    navItems: [
      {
        name: "Overview",
        href: "/dashboard",
        icon: DashboardIcon,
      },
      {
        name: "Manage Users",
        href: "/dashboard/admin/users",
        icon: UsersIcon,
      },
      {
        name: "Manage Menu Items",
        href: "/dashboard/admin/menu",
        icon: PizzaIcon,
      },
      {
        name: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: CreditCardIcon,
      },
      {
        name: "Profile Settings",
        href: "/profile",
        icon: SettingsIcon,
      },
    ],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentRole: UserRole = user?.role || "customer";
  const activeConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.customer;
  const RoleIcon = activeConfig.icon;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFBF7] dark:bg-[#100E0D] text-[#1C1917] dark:text-[#F5F3F0]">
      {/* Mobile Top Header for Dashboard */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-20 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-xs">
            <RoleIcon size={16} />
          </div>
          <div>
            <span className="font-heading text-sm font-bold block text-stone-900 dark:text-white">
              {activeConfig.title}
            </span>
            <span className="text-[10px] text-stone-400 capitalize">
              {user?.businessName || user?.name || "Welcome"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          aria-label="Toggle navigation sidebar"
        >
          {mobileSidebarOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Slide-Out */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-72 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
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
                  {activeConfig.title}
                </span>
              </div>
            </Link>

            {/* Current Role Identity Card */}
            <div className="mt-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200">
                  <RoleIcon size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Active View
                  </span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 capitalize truncate block">
                    {activeConfig.roleLabel}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeConfig.badgeStyle}`}
              >
                {activeConfig.roleLabel}
              </span>
            </div>
          </div>

          {/* Role Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Menu Navigation
              </span>
            </div>
            {activeConfig.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-red-600" : "text-stone-400"}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Summary at bottom of Sidebar */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-3 shrink-0">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-900 border border-stone-700/60 shadow-sm shrink-0">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-amber-600 text-white font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {user.businessName || user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${activeConfig.badgeStyle}`}
                  >
                    {user.role}
                  </span>
                  {user.role === "vendor" &&
                    user.subscriptionPlan === "premium" && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-xs">
                        PRO
                      </span>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-xs text-stone-500">
              <span>Browsing as guest</span>
            </div>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-red-600 hover:border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOutIcon size={14} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              href="/signin"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
            >
              <span>Sign In to Your Account</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
