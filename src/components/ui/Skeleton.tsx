import React from "react";

// 1. Base Skeleton primitive
export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-stone-200/80 dark:bg-stone-800/80 rounded-xl ${className}`}
      {...props}
    />
  );
}

// 2. Pizza Card Skeleton (For Menu Grid, Home Featured, Vendor Catalog)
export function PizzaCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-xs animate-pulse">
      {/* Pizza Image Placeholder */}
      <div className="relative aspect-4/3 w-full bg-stone-200 dark:bg-stone-800">
        <div className="absolute top-3 left-3 h-5 w-20 rounded-full bg-stone-300 dark:bg-stone-700" />
      </div>

      {/* Card Content Placeholder */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-2/3 rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="h-5 w-12 rounded-lg bg-stone-200 dark:bg-stone-800" />
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 w-full rounded-md bg-stone-200/70 dark:bg-stone-800/70" />
          <div className="h-3.5 w-4/5 rounded-md bg-stone-200/70 dark:bg-stone-800/70" />
        </div>

        {/* Footer with Price and Button Placeholder */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between">
          <div className="h-6 w-16 rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="h-8 w-24 rounded-xl bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    </div>
  );
}

// 3. Table Row Skeleton (For Admin Users, Admin Menu, Transactions tables)
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-stone-100 dark:border-stone-800/60 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 rounded-md bg-stone-200/80 dark:bg-stone-800/80 w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// 4. Order Card Skeleton (For My-Orders & Vendor-Orders lists)
export function OrderCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-200 dark:bg-stone-800 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded-md bg-stone-200 dark:bg-stone-800" />
            <div className="h-3 w-20 rounded-md bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-stone-200 dark:bg-stone-800" />
      </div>

      <div className="h-10 w-full rounded-2xl bg-stone-100 dark:bg-stone-800/50" />

      <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
        <div className="h-5 w-16 rounded-md bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-24 rounded-xl bg-stone-200 dark:bg-stone-800" />
      </div>
    </div>
  );
}

// 5. Stat Card Skeleton (For Dashboard Overview Metrics)
export function StatCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-xs animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-24 rounded-md bg-stone-200 dark:bg-stone-800" />
        <div className="w-9 h-9 rounded-xl bg-stone-200 dark:bg-stone-800" />
      </div>
      <div className="h-8 w-16 rounded-lg bg-stone-200 dark:bg-stone-800" />
      <div className="h-3 w-32 rounded-md bg-stone-200 dark:bg-stone-800" />
    </div>
  );
}

// 6. Pizza Detail Skeleton (For /menu/[id] page)
export function PizzaDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
      <div className="h-4 w-36 rounded-md bg-stone-200 dark:bg-stone-800" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="aspect-4/3 w-full rounded-3xl bg-stone-200 dark:bg-stone-800" />
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-5 w-24 rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="h-8 w-3/4 rounded-xl bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="h-8 w-28 rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-5/6 rounded-md bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-2/3 rounded-md bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="h-12 w-full rounded-2xl bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    </div>
  );
}
