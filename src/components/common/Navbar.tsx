"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import {
  PizzaIcon,
  ChevronDownIcon,
  UserIcon,
  DashboardIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/ui/Icons";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  // Close menus when route changes
  if (pathname !== currentPath) {
    setCurrentPath(pathname);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Role-based navigation links
  const getRoleLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case "customer":
        return [
          { name: "Dashboard", href: "/dashboard" },
          { name: "My Orders", href: "/dashboard/orders" },
        ];
      case "vendor":
        return [
          { name: "Dashboard", href: "/dashboard" },
          { name: "My Menu", href: "/dashboard/menu" },
          { name: "Add Item", href: "/dashboard/add-item" },
          { name: "Orders", href: "/dashboard/vendor-orders" },
        ];
      case "admin":
        return [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Manage Users", href: "/dashboard/users" },
          { name: "Manage Menu", href: "/dashboard/menu-items" },
          { name: "Transactions", href: "/dashboard/transactions" },
        ];
      default:
        return [];
    }
  };

  const roleLinks = getRoleLinks();

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "vendor":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="PizzaHub Home"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-red-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <PizzaIcon size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F3F0]">
                  Pizza<span className="text-red-600">Hub</span>
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-stone-500 dark:text-stone-400">
                Artisan Woodfired
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                pathname === "/"
                  ? "text-red-600 bg-red-500/10"
                  : "text-stone-700 dark:text-stone-300 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800/60"
              }`}
            >
              Home
            </Link>

            <Link
              href="/menu"
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                pathname.startsWith("/menu")
                  ? "text-red-600 bg-red-500/10"
                  : "text-stone-700 dark:text-stone-300 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800/60"
              }`}
            >
              Browse Menu
            </Link>

            {/* Dynamic Role Links */}
            {isLoggedIn &&
              roleLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? "text-red-600 bg-red-500/10"
                      : "text-stone-700 dark:text-stone-300 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800/60"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Auth State Conditional UI */}
            {isLoggedIn && user ? (
              /* Logged In: Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
                  aria-expanded={dropdownOpen}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 ring-2 ring-red-500/20">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-600 font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {/* Active online green dot positioned outside overflow-hidden */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-stone-900 shadow-xs" />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded-md border w-fit ${getRoleBadgeStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <ChevronDownIcon
                    size={16}
                    className={`text-stone-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User summary header */}
                    <div className="px-3 py-3 border-b border-stone-100 dark:border-stone-800">
                      <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                        {user.subscriptionPlan === "premium" && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-xs">
                            Premium Vendor
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-2 space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <DashboardIcon size={18} className="text-red-600" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <SettingsIcon size={18} className="text-stone-500" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOutIcon size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Public / Logged Out: Sign In & Sign Up buttons */
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-bold text-stone-800 dark:text-stone-200 hover:text-red-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                >
                  <UserIcon size={16} />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className={`px-3 py-2 text-base font-semibold rounded-xl ${
                pathname === "/"
                  ? "bg-red-50 dark:bg-red-950/30 text-red-600"
                  : "text-stone-800 dark:text-stone-200"
              }`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`px-3 py-2 text-base font-semibold rounded-xl ${
                pathname === "/menu"
                  ? "bg-red-50 dark:bg-red-950/30 text-red-600"
                  : "text-stone-800 dark:text-stone-200"
              }`}
            >
              Browse Menu
            </Link>

            {isLoggedIn &&
              roleLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-base font-semibold rounded-xl ${
                    pathname === link.href
                      ? "bg-red-50 dark:bg-red-950/30 text-red-600"
                      : "text-stone-800 dark:text-stone-200"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </nav>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
            {isLoggedIn && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200">
                    {user.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-stone-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                >
                  <LogOutIcon size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/signin"
                  className="w-full text-center py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm font-bold text-stone-800 dark:text-stone-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-sm font-bold text-white shadow-md shadow-red-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
