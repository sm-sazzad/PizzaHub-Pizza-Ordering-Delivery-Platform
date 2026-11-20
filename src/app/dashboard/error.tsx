"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  RefreshIcon,
  DashboardIcon,
} from "@/components/ui/Icons";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full text-center space-y-6 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
        {/* Error Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircleIcon size={32} />
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Dashboard Error
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            Failed to Load Dashboard Data
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            An unexpected error occurred while preparing this dashboard view. Your session and sidebar remain active.
          </p>
        </div>

        {/* Error Details */}
        {error.message && (
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Issue Details
            </span>
            <p className="text-xs font-mono text-stone-600 dark:text-stone-300 break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshIcon size={16} />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <DashboardIcon size={16} />
            <span>Dashboard Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
