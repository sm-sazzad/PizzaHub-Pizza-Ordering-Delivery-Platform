import React from "react";
import { PizzaCardSkeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-pulse">
      {/* Top Banner / Hero Skeleton */}
      <div className="rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-8 sm:p-12 space-y-4">
        <div className="h-6 w-32 rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="h-10 w-2/3 sm:w-1/2 rounded-2xl bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-full sm:w-3/4 rounded-lg bg-stone-200 dark:bg-stone-800" />
        <div className="pt-2 flex gap-3">
          <div className="h-11 w-32 rounded-2xl bg-stone-200 dark:bg-stone-800" />
          <div className="h-11 w-32 rounded-2xl bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>

      {/* Grid Section Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 rounded-xl bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-72 rounded-md bg-stone-200/70 dark:bg-stone-800/70" />
          </div>
          <div className="h-8 w-24 rounded-xl bg-stone-200 dark:bg-stone-800" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PizzaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
