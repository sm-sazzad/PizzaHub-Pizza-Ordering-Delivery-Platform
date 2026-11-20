"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PizzaIcon,
  LockIcon,
  AlertCircleIcon,
  LogOutIcon,
  MailIcon,
} from "@/components/ui/Icons";

export default function BlockedPage() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#FDFBF7] dark:bg-[#100E0D] text-[#1C1917] dark:text-[#F5F3F0]">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 dark:bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 sm:p-10 shadow-2xl transition-all text-center">
          {/* PizzaHub Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <PizzaIcon size={22} className="text-white" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Pizza<span className="text-red-600">Hub</span>
            </span>
          </Link>

          {/* Suspended Lock Badge */}
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-rose-500/15 animate-ping opacity-75" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/25">
              <LockIcon size={36} className="text-white" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertCircleIcon size={14} />
            <span>Access Restricted</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-3">
            Account Suspended
          </h1>

          {/* Description */}
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
            Your PizzaHub account has been suspended by an administrator. You do
            not have permission to access dashboard features or place food orders
            at this time.
          </p>

          {/* User Account Info Box (if logged in) */}
          {isLoggedIn && user && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-left mb-6 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-stone-500 dark:text-stone-400">
                <span>Account Name:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
                  {user.name || "Customer"}
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-500 dark:text-stone-400">
                <span>Email Address:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400">Status:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Suspended
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center transition-all shadow-xs"
            >
              Return Home
            </Link>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={logout}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOutIcon size={16} />
                <span>Log Out</span>
              </button>
            ) : (
              <Link
                href="/signin"
                className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Support help footnote */}
          <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Think this was a mistake?{" "}
              <a
                href="mailto:support@pizzahub.com"
                className="font-bold text-red-600 hover:text-red-500 inline-flex items-center gap-1 underline underline-offset-2 ml-1"
              >
                <MailIcon size={12} />
                <span>Contact Support</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
