"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  RefreshIcon,
  PizzaIcon,
} from "@/components/ui/Icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 1. Log the error for debugging
  useEffect(() => {
    console.error("App error caught by Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircleIcon size={36} />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            We encountered an unexpected error while preparing this page. Don&apos;t worry, our kitchen team has been alerted!
          </p>
        </div>

        {/* Error message box */}
        {error.message && (
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Error Details
            </span>
            <p className="text-xs font-mono text-stone-600 dark:text-stone-300 break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons: Try Again & Go Home */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Try Again Button (Calls Next.js reset function) */}
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshIcon size={16} />
            <span>Try Again</span>
          </button>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <PizzaIcon size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
