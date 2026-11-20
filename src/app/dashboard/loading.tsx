import React from "react";
import { StatCardSkeleton, OrderCardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 space-y-3">
        <div className="h-4 w-28 rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-60 rounded-xl bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-80 max-w-full rounded-md bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* 4 Stats Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Orders / Activity Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 rounded-lg bg-stone-200 dark:bg-stone-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
