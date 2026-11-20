import React from "react";
import Link from "next/link";
import { PizzaIcon, ArrowRightIcon } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/20 shadow-lg">
          <PizzaIcon size={48} className="animate-pulse" />
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-black bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md border border-stone-800">
            404
          </span>
        </div>

        {/* Heading & Friendly User Message */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Page or Pizza Not Found
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
            Oops! That slice is missing
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
            The pizza recipe or page you are looking for doesn&apos;t exist, may
            have been retired by the kitchen, or the link is incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <PizzaIcon size={16} />
            <span>Browse Pizza Menu</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>Back to Home</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
