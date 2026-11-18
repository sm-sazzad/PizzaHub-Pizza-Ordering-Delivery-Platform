"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PizzaIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckIcon,
  TrendingUpIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  DollarSignIcon,
} from "@/components/ui/Icons";

export default function VendorDashboardOverview() {
  const { user } = useAuth();

  // Mock data representing the vendor's statistics (as per Assignment 9 PDF Page 7)
  const stats = {
    totalMenuItems: 3,
    activeMenuItems: 2,
    pendingOrders: 4,
    acceptedOrders: 18,
    todayRevenue: 342.5,
    subscriptionPlan: user?.subscriptionPlan || "free",
  };

  const isFreePlan = stats.subscriptionPlan === "free";
  const activeLimit = isFreePlan ? 3 : "Unlimited";

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Kitchen Overview
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Welcome, {user?.businessName || user?.name || "Luigi's Woodfired Pizzeria"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Monitor incoming customer orders, review active pizzas, and manage your kitchen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/add-item"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <PlusCircleIcon size={16} />
            <span>Add Menu Item</span>
          </Link>
        </div>
      </div>

      {/* Subscription Status Card (Assignment 9 PDF Page 7 & 8) */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 border transition-all ${
          isFreePlan
            ? "bg-gradient-to-br from-amber-500/10 via-stone-50 to-white dark:from-amber-950/20 dark:via-stone-900 dark:to-stone-900 border-amber-500/30"
            : "bg-gradient-to-br from-red-500/10 via-amber-500/10 to-stone-900 text-white border-red-500/30"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <SparklesIcon size={14} />
              <span>Current Plan: {isFreePlan ? "Free Tier" : "Premium Tier"}</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              {isFreePlan
                ? "You are currently on the Free Vendor Plan"
                : "Active Premium Membership Activated"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {isFreePlan
                ? "Free plan allows up to 3 active menu items. Upgrade to Premium with Stripe to unlock unlimited menu items, premium verified badge, and featured homepage promotion."
                : "Enjoy unlimited active menu items, the verified Gold vendor badge, and prominent priority placement on PizzaHub."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {isFreePlan ? (
              <Link
                href="/dashboard/subscription"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Upgrade to Premium</span>
                <ArrowRightIcon size={14} />
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-2">
                <CheckIcon size={16} />
                <span>Unlimited Items Active</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Required Key Statistics Cards (Assignment 9 PDF Page 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Menu Items */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Menu Items
            </span>
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <PizzaIcon size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-stone-900 dark:text-white">
              {stats.totalMenuItems}
            </span>
            <span className="text-xs font-semibold text-stone-400">pizzas listed</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
            Published in menu catalog
          </p>
        </div>

        {/* Active Menu Items */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Active Menu Items
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckIcon size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.activeMenuItems}
            </span>
            <span className="text-xs font-semibold text-stone-400">/ {activeLimit}</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
            {isFreePlan ? "1 free slot remaining" : "Unlimited active capacity"}
          </p>
        </div>

        {/* Pending Customer Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Pending Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ClockIcon size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-amber-600 dark:text-amber-400">
              {stats.pendingOrders}
            </span>
            <span className="text-xs font-semibold text-amber-500 animate-pulse">Needs Action</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
            Awaiting kitchen acceptance
          </p>
        </div>

        {/* Accepted Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Accepted Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShoppingBagIcon size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black text-stone-900 dark:text-white">
              {stats.acceptedOrders}
            </span>
            <span className="text-xs font-semibold text-emerald-500">+12% this week</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
            In oven / out for delivery
          </p>
        </div>
      </div>

      {/* Data Visualization & Weekly Kitchen Performance (PDF Page 12 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Orders Bar Visualization (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
                Weekly Order Volume
              </h4>
              <p className="text-xs text-stone-400">Daily pizzas dispatched across the last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
              <TrendingUpIcon size={14} />
              <span>+18.4%</span>
            </div>
          </div>

          {/* Pure SVG responsive bar chart */}
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 border-b border-stone-100 dark:border-stone-800 pb-2">
              {[
                { day: "Mon", count: 12, height: "45%" },
                { day: "Tue", count: 16, height: "60%" },
                { day: "Wed", count: 14, height: "52%" },
                { day: "Thu", count: 22, height: "80%" },
                { day: "Fri", count: 28, height: "98%", active: true },
                { day: "Sat", count: 25, height: "90%" },
                { day: "Sun", count: 19, height: "70%" },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    style={{ height: item.height }}
                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-300 ${
                      item.active
                        ? "bg-gradient-to-t from-red-600 to-amber-500 shadow-md shadow-red-500/20"
                        : "bg-stone-200 dark:bg-stone-800 group-hover:bg-amber-500/60"
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Revenue Summary & Kitchen Actions (4 cols) */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Today&apos;s Estimated Sales
            </span>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <DollarSignIcon size={20} />
              </div>
              <div>
                <span className="font-heading text-3xl font-black text-stone-900 dark:text-white">
                  ${stats.todayRevenue.toFixed(2)}
                </span>
                <p className="text-[11px] text-stone-400">From 18 accepted orders</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-300">
                <span>Avg. Oven Bake Time</span>
                <strong className="text-stone-900 dark:text-white">90 seconds</strong>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-300">
                <span>Customer Satisfaction</span>
                <strong className="text-amber-500">★ 4.96 / 5.0</strong>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/vendor-orders"
            className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>View Pending Customer Orders</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
