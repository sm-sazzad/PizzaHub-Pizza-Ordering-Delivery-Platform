import React from "react";
import { PizzaCardSkeleton } from "@/components/ui/Skeleton";

export default function MenuLoading() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="pb-6 border-b border-stone-200 dark:border-stone-800 space-y-4">
        <div className="h-4 w-32 rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-64 rounded-2xl bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-96 max-w-full rounded-md bg-stone-200 dark:bg-stone-800" />

        {/* Search bar & filter pills skeleton */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="h-11 w-full sm:w-80 rounded-2xl bg-stone-200 dark:bg-stone-800" />
          <div className="flex gap-2 w-full sm:w-auto overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-20 rounded-xl bg-stone-200 dark:bg-stone-800 shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pizza Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PizzaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
