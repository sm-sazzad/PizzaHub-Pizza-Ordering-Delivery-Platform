"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PizzaIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  UsersIcon,
  CreditCardIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
  StoreIcon,
  TrendingUpIcon,
  DollarSignIcon,
} from "@/components/ui/Icons";

function CustomerOverview({
  user,
}: {
  user: { name?: string; email?: string } | null;
}) {
  // Real data state - starts empty (0) until fetched from MongoDB / Express
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
  });
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentOrders, setRecentOrders] = useState<
    Array<{
      id: string;
      itemName: string;
      vendorName: string;
      price: number;
      status: string;
      deliveryDate: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When MongoDB backend is running, fetch customer orders by email
    const fetchCustomerData = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/orders?email=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const rawOrders = Array.isArray(data) ? data : data.orders || [];
          const formatted = rawOrders.map(
            (
              o: {
                _id?: string;
                id?: string;
                itemName?: string;
                vendorName?: string;
                price?: number;
                status?: string;
                deliveryDate?: string;
                createdAt?: string;
              },
              idx: number,
            ) => ({
              id: o._id || o.id || `order-${idx}`,
              itemName: o.itemName || "Artisan Pizza",
              vendorName: o.vendorName || "Partner Kitchen",
              price: typeof o.price === "number" ? o.price : 0,
              status: o.status || "pending",
              deliveryDate:
                o.deliveryDate ||
                (o.createdAt
                  ? new Date(o.createdAt).toLocaleDateString()
                  : "Recently"),
            }),
          );
          setRecentOrders(formatted.slice(0, 5));
          setStats({
            totalOrders: rawOrders.length,
            pendingOrders: rawOrders.filter(
              (o: { status: string }) => o.status === "pending",
            ).length,
            acceptedOrders: rawOrders.filter(
              (o: { status: string }) => o.status === "accepted",
            ).length,
            rejectedOrders: rawOrders.filter(
              (o: { status: string }) => o.status === "rejected",
            ).length,
          });

          // Calculate total spending
          const spent = rawOrders.reduce(
            (sum: number, o: { price?: number }) =>
              sum + (typeof o.price === "number" ? o.price : 0),
            0,
          );
          setTotalSpent(spent);
        }
      } catch {
        // Backend not yet reachable or empty DB; keep initial clean states
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [user?.email]);

  // Bar Chart Data for Customer Orders
  const orderBars = [
    { label: "Total Orders", value: stats.totalOrders, color: "bg-red-600" },
    { label: "Pending", value: stats.pendingOrders, color: "bg-amber-500" },
    { label: "Accepted", value: stats.acceptedOrders, color: "bg-emerald-500" },
    { label: "Declined", value: stats.rejectedOrders, color: "bg-stone-500" },
  ];

  const maxBarValue = Math.max(...orderBars.map((b) => b.value), 1);

  // Status percentages for fulfillment breakdown
  const orderTotal = Math.max(stats.totalOrders, 1);
  const acceptedPercent = Math.round((stats.acceptedOrders / orderTotal) * 100);
  const pendingPercent = Math.round((stats.pendingOrders / orderTotal) * 100);
  const rejectedPercent = Math.max(0, 100 - acceptedPercent - pendingPercent);

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Customer Portal
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Welcome back, {user?.name || "Customer"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Track your pizza orders, monitor delivery status, and reorder from
            top local kitchens.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <PizzaIcon size={16} />
          <span>Explore Menu</span>
        </Link>
      </div>

      {/* 4 Stat Cards for Customer (Assignment 9 PDF Page 6) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <ShoppingBagIcon size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 dark:text-white font-heading">
            {stats.totalOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">
            All time orders placed
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ClockIcon size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-600 font-heading">
            {stats.pendingOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">
            Awaiting kitchen confirmation
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Accepted Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckIcon size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-600 font-heading">
            {stats.acceptedOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">
            Baking or out for delivery
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Rejected Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
              <AlertCircleIcon size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-600 dark:text-stone-300 font-heading">
            {stats.rejectedOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">
            Cancelled or declined
          </span>
        </div>
      </div>

      {/* Customer Orders Bar Chart & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Orders Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-red-500/10 text-red-600">
                  <TrendingUpIcon size={16} />
                </span>
                <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                  Order Activity Bar Chart
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Visual breakdown of your total, pending, and confirmed pizza meals
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              Live Activity
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 flex items-end justify-between gap-4 sm:gap-8 pt-8 pb-2 px-4 border-b border-stone-100 dark:border-stone-800">
            {orderBars.map((bar) => {
              const heightPercent =
                maxBarValue > 0
                  ? Math.max(Math.round((bar.value / maxBarValue) * 100), 8)
                  : 8;

              return (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  {/* Value tag above bar */}
                  <span className="text-[11px] font-bold font-mono text-stone-700 dark:text-stone-300 mb-1.5 transition-transform group-hover:-translate-y-0.5">
                    {isLoading ? "..." : bar.value}
                  </span>

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[56px] bg-stone-100 dark:bg-stone-800/80 rounded-2xl p-1.5 flex items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-xl transition-all duration-500 ${bar.color}`}
                    />
                  </div>

                  {/* Label below bar */}
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-2 text-center truncate max-w-full">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-4 pt-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Total Orders
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Accepted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-500" /> Declined
            </span>
          </div>
        </div>

        {/* Side Ratio & Spending Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
              Fulfillment Summary
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Delivery success and meal progress
            </p>

            <div className="space-y-5">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Order Status Ratio
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {stats.acceptedOrders} / {stats.totalOrders} Completed
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                  <div
                    style={{ width: `${acceptedPercent}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Accepted: ${acceptedPercent}%`}
                  />
                  <div
                    style={{ width: `${pendingPercent}%` }}
                    className="bg-amber-500 h-full transition-all duration-500"
                    title={`Pending: ${pendingPercent}%`}
                  />
                  <div
                    style={{ width: `${rejectedPercent}%` }}
                    className="bg-stone-500 h-full transition-all duration-500"
                    title={`Declined: ${rejectedPercent}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1.5">
                  <span className="text-emerald-500 font-semibold">Accepted ({acceptedPercent}%)</span>
                  <span className="text-amber-500 font-semibold">Pending ({pendingPercent}%)</span>
                  <span className="text-stone-400 font-semibold">Declined ({rejectedPercent}%)</span>
                </div>
              </div>

              {/* Total Spending Pill */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Total Pizza Spending
                </span>
                <span className="font-heading text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                  <DollarSignIcon size={20} className="text-emerald-500" />
                  <span>{totalSpent.toFixed(2)}</span>
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  Across {stats.totalOrders} total meals ordered
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Customer Activity</span>
            <span className="font-semibold text-emerald-500">Updated Real-Time</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
              Recent Pizza Orders
            </h3>
            <p className="text-xs text-stone-500">
              Live status updates for your current and past meals.
            </p>
          </div>
          <Link
            href="/dashboard/my-orders"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          /* Empty State - Clean, No Fake Demo Data */
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
              <ShoppingBagIcon size={32} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              No orders placed yet
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              {isLoading
                ? "Checking database for order history..."
                : "You haven't ordered any pizzas yet. Browse artisan woodfired pizzas from our partner kitchens and place your first order!"}
            </p>
            <Link
              href="/menu"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <PizzaIcon size={16} />
              <span>Browse Pizza Menu</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800 mt-2">
            {recentOrders.map((order, idx) => (
              <div
                key={order.id || `order-${idx}`}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h5 className="text-sm font-bold text-stone-900 dark:text-white">
                    {order.itemName}
                  </h5>
                  <p className="text-xs text-stone-500">
                    By {order.vendorName} • Delivery: {order.deliveryDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-stone-900 dark:text-white text-sm">
                    ${order.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      order.status === "accepted"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : order.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-stone-500/10 text-stone-500 border-stone-500/20"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 2. VENDOR DASHBOARD OVERVIEW (Assignment 9 PDF Page 7)
// ============================================================================
function VendorOverview({
  user,
}: {
  user: {
    name?: string;
    email?: string;
    businessName?: string;
    subscriptionPlan?: "free" | "premium";
  } | null;
}) {
  // Real stats - starts empty (0) until fetched from MongoDB / Express
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    activeMenuItems: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isFreePlan = (user?.subscriptionPlan || "free") === "free";

  useEffect(() => {
    // When MongoDB backend is running, fetch real vendor counts
    const fetchVendorData = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const [menuRes, ordersRes] = await Promise.all([
          fetch(
            `${serverUrl}/menu?vendorEmail=${encodeURIComponent(user.email)}`,
          ),
          fetch(`${serverUrl}/orders?email=${encodeURIComponent(user.email)}`),
        ]);

        let totalItems = 0;
        let activeItems = 0;
        let pending = 0;
        let accepted = 0;
        let revenue = 0;

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          const items = Array.isArray(menuData) ? menuData : [];
          totalItems = items.length;
          activeItems = items.filter(
            (i: { status: string }) => i.status === "approved",
          ).length;
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders = Array.isArray(ordersData) ? ordersData : [];
          pending = orders.filter(
            (o: { status: string }) => o.status === "pending",
          ).length;
          accepted = orders.filter(
            (o: { status: string }) => o.status === "accepted",
          ).length;
          revenue = orders
            .filter((o: { status: string }) => o.status === "accepted")
            .reduce(
              (sum: number, o: { totalAmount?: number; price?: number }) =>
                sum + (o.totalAmount || o.price || 0),
              0,
            );
        }

        setTotalRevenue(revenue);
        setStats({
          totalMenuItems: totalItems,
          activeMenuItems: activeItems,
          pendingOrders: pending,
          acceptedOrders: accepted,
        });
      } catch {
        // Backend not yet reachable or empty DB; keep initial clean states
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [user?.email]);

  // Vendor Bar Chart Data
  const vendorBars = [
    { label: "Total Menu", value: stats.totalMenuItems, color: "bg-red-600" },
    { label: "Live Pizzas", value: stats.activeMenuItems, color: "bg-emerald-500" },
    { label: "Pending Orders", value: stats.pendingOrders, color: "bg-amber-500" },
    { label: "Fulfilled Orders", value: stats.acceptedOrders, color: "bg-blue-600" },
  ];

  const maxVendorBarValue = Math.max(...vendorBars.map((b) => b.value), 1);

  // Fulfillment and Menu Ratios
  const menuTotal = Math.max(stats.totalMenuItems, 1);
  const activeMenuPercent = Math.round((stats.activeMenuItems / menuTotal) * 100);
  const pendingMenuPercent = Math.max(0, 100 - activeMenuPercent);

  const orderTotal = Math.max(stats.pendingOrders + stats.acceptedOrders, 1);
  const fulfilledPercent = Math.round((stats.acceptedOrders / orderTotal) * 100);
  const pendingOrderPercent = Math.max(0, 100 - fulfilledPercent);

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Kitchen Overview
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Welcome, {user?.businessName || user?.name || "Partner Kitchen"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Monitor incoming customer orders, review active pizzas, and manage
            your kitchen.
          </p>
        </div>

        <Link
          href="/dashboard/add-item"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <PlusCircleIcon size={16} />
          <span>Add Menu Item</span>
        </Link>
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
              <span>
                Current Plan: {isFreePlan ? "Free Tier" : "Premium Tier"}
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
              {isFreePlan
                ? "You are currently on the Free Vendor Plan"
                : "Active Premium Membership Activated"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {isFreePlan
                ? `Free plan allows up to 3 active menu items (currently using ${stats.activeMenuItems} of 3). Upgrade to Premium to unlock unlimited items and priority placement.`
                : "Enjoy unlimited active menu items, the verified Gold vendor badge, and priority placement across PizzaHub."}
            </p>
          </div>

          <div>
            {isFreePlan ? (
              <Link
                href="/dashboard/subscription"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Upgrade to Premium</span>
                <ArrowRightIcon size={14} />
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-2">
                <CheckIcon size={14} />
                <span>Unlimited Items Active</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards for Vendor (Assignment 9 PDF Page 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Items
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <PizzaIcon size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 dark:text-white font-heading">
            {stats.totalMenuItems}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">
            Published recipes
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Active Items
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckIcon size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-600 font-heading">
              {stats.activeMenuItems}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1">
            Available for order
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ClockIcon size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-600 font-heading">
            {stats.pendingOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">
            Awaiting kitchen action
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Accepted Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShoppingBagIcon size={18} />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-600 font-heading">
            {stats.acceptedOrders}
          </span>
          <span className="text-[11px] text-stone-400 mt-1">
            Fulfilled successfully
          </span>
        </div>
      </div>

      {/* Kitchen Operations Bar Chart & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Kitchen Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-500/10 text-amber-600">
                  <TrendingUpIcon size={16} />
                </span>
                <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                  Kitchen Operations Bar Chart
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Visual activity comparison of your recipes, customer orders, and fulfillment
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              Kitchen Stats
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 flex items-end justify-between gap-4 sm:gap-8 pt-8 pb-2 px-4 border-b border-stone-100 dark:border-stone-800">
            {vendorBars.map((bar) => {
              const heightPercent =
                maxVendorBarValue > 0
                  ? Math.max(Math.round((bar.value / maxVendorBarValue) * 100), 8)
                  : 8;

              return (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  {/* Value tag above bar */}
                  <span className="text-[11px] font-bold font-mono text-stone-700 dark:text-stone-300 mb-1.5 transition-transform group-hover:-translate-y-0.5">
                    {isLoading ? "..." : bar.value}
                  </span>

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[56px] bg-stone-100 dark:bg-stone-800/80 rounded-2xl p-1.5 flex items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-xl transition-all duration-500 ${bar.color}`}
                    />
                  </div>

                  {/* Label below bar */}
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-2 text-center truncate max-w-full">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-4 pt-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Total Menu
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Live Pizzas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending Orders
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Fulfilled
            </span>
          </div>
        </div>

        {/* Side Performance & Revenue Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
              Kitchen Performance
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Menu approval & fulfillment ratios
            </p>

            <div className="space-y-5">
              {/* 1. Menu Status Ratio */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Menu: Approved vs Pending
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {stats.activeMenuItems} / {stats.totalMenuItems} Live
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                  <div
                    style={{ width: `${activeMenuPercent}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Live: ${activeMenuPercent}%`}
                  />
                  <div
                    style={{ width: `${pendingMenuPercent}%` }}
                    className="bg-amber-500 h-full transition-all duration-500"
                    title={`Pending Review: ${pendingMenuPercent}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1.5">
                  <span className="text-emerald-500 font-semibold">Live ({activeMenuPercent}%)</span>
                  <span className="text-amber-500 font-semibold">In Review ({pendingMenuPercent}%)</span>
                </div>
              </div>

              {/* 2. Order Fulfillment Ratio */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Order Completion Rate
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {stats.acceptedOrders} / {stats.pendingOrders + stats.acceptedOrders} Orders
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                  <div
                    style={{ width: `${fulfilledPercent}%` }}
                    className="bg-blue-600 h-full transition-all duration-500"
                    title={`Fulfilled: ${fulfilledPercent}%`}
                  />
                  <div
                    style={{ width: `${pendingOrderPercent}%` }}
                    className="bg-amber-500 h-full transition-all duration-500"
                    title={`Pending: ${pendingOrderPercent}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1.5">
                  <span className="text-blue-500 font-semibold">Fulfilled ({fulfilledPercent}%)</span>
                  <span className="text-amber-500 font-semibold">Pending ({pendingOrderPercent}%)</span>
                </div>
              </div>

              {/* 3. Total Kitchen Earnings Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Fulfilled Orders Revenue
                </span>
                <span className="font-heading text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                  <DollarSignIcon size={20} className="text-emerald-500" />
                  <span>{totalRevenue.toFixed(2)}</span>
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  From {stats.acceptedOrders} completed kitchen orders
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Kitchen Analytics</span>
            <span className="font-semibold text-emerald-500">Live Express Feed</span>
          </div>
        </div>
      </div>

      {/* Quick Action / Real State Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Items Quick View */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h4 className="font-heading text-sm font-bold text-stone-900 dark:text-white">
                Menu Management
              </h4>
              <Link
                href="/dashboard/menu"
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                View Items &rarr;
              </Link>
            </div>
            {stats.totalMenuItems === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-stone-500 mb-3">
                  {isLoading
                    ? "Loading your menu recipes..."
                    : "No menu items published yet. Add your kitchen's signature pizza recipes!"}
                </p>
                <Link
                  href="/dashboard/add-item"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
                >
                  <PlusCircleIcon size={14} />
                  <span>Create First Item</span>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-4">
                You have {stats.totalMenuItems} recipes published (
                {stats.activeMenuItems} active).
              </p>
            )}
          </div>
        </div>

        {/* Orders Quick View */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h4 className="font-heading text-sm font-bold text-stone-900 dark:text-white">
                Customer Orders
              </h4>
              <Link
                href="/dashboard/vendor-orders"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                Manage Orders &rarr;
              </Link>
            </div>
            {stats.pendingOrders === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-stone-500">
                  {isLoading
                    ? "Syncing order requests..."
                    : "No pending orders right now. New customer orders will show up here in real-time."}
                </p>
              </div>
            ) : (
              <p className="text-xs text-amber-600 py-4 font-semibold">
                You have {stats.pendingOrders} pending order(s) awaiting your
                decision!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. ADMIN DASHBOARD OVERVIEW (Assignment 9 PDF Page 8)
// ============================================================================
interface AdminUser {
  role?: string;
  subscriptionPlan?: string;
}

interface AdminMenuItem {
  status?: string;
}

function AdminOverview({
  user,
}: {
  user: { name?: string; email?: string } | null;
}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin data from Express backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // 1. Fetch all users
        const usersRes = await fetch(`${serverUrl}/admin/users`);
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        }

        // 2. Fetch all menu items
        const menuRes = await fetch(`${serverUrl}/admin/menu`);
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenuItems(Array.isArray(menuData) ? menuData : []);
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Calculate 6 metrics required by Assignment 9
  const totalUsers = users.length;
  const totalVendors = users.filter((u) => u.role === "vendor").length;
  const totalCustomers = users.filter((u) => u.role === "customer" || !u.role).length;
  const totalMenuItems = menuItems.length;
  const pendingItems = menuItems.filter((m) => m.status === "pending").length;
  const approvedMenuItems = Math.max(totalMenuItems - pendingItems, 0);
  const totalTransactions = users.filter((u) => u.subscriptionPlan === "premium").length;

  // Bar Chart Data for the 6 core metrics
  const chartBars = [
    { label: "Total Users", value: totalUsers, color: "bg-purple-600" },
    { label: "Vendors", value: totalVendors, color: "bg-amber-500" },
    { label: "Customers", value: totalCustomers, color: "bg-emerald-500" },
    { label: "Menu Items", value: totalMenuItems, color: "bg-red-500" },
    { label: "Pending", value: pendingItems, color: "bg-orange-500" },
    { label: "Transactions", value: totalTransactions, color: "bg-blue-600" },
  ];

  // Maximum value for scaling bar heights
  const maxBarValue = Math.max(...chartBars.map((b) => b.value), 1);

  // Percentages for distribution graphs
  const userTotal = Math.max(totalVendors + totalCustomers, 1);
  const vendorPercent = Math.round((totalVendors / userTotal) * 100);
  const customerPercent = 100 - vendorPercent;

  const menuTotal = Math.max(totalMenuItems, 1);
  const approvedPercent = Math.round((approvedMenuItems / menuTotal) * 100);
  const pendingPercent = 100 - approvedPercent;

  const premiumPercent = totalUsers > 0 ? Math.round((totalTransactions / totalUsers) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Admin Console
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            System Administration ({user?.name || "Administrator"})
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Platform oversight, user management, recipe approvals, and financial transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
          <ShieldCheckIcon size={16} />
          <span>Superadmin Access</span>
        </div>
      </div>

      {/* 6 Stat Cards (Assignment 9 PDF Requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Registered Users */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
              Total Users
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <UsersIcon size={14} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 dark:text-white font-heading">
              {loading ? "..." : totalUsers}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Registered users
            </span>
          </div>
        </div>

        {/* 2. Total Vendors */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Total Vendors
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <StoreIcon size={14} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-amber-600 font-heading">
              {loading ? "..." : totalVendors}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Kitchen partners
            </span>
          </div>
        </div>

        {/* 3. Total Customers */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Total Customers
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShoppingBagIcon size={14} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600 font-heading">
              {loading ? "..." : totalCustomers}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Active foodies
            </span>
          </div>
        </div>

        {/* 4. Total Menu Items */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
              Menu Items
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <PizzaIcon size={14} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-red-600 font-heading">
              {loading ? "..." : totalMenuItems}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Total pizzas
            </span>
          </div>
        </div>

        {/* 5. Pending Menu Items */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Pending Items
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <ClockIcon size={14} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-orange-600 font-heading">
              {loading ? "..." : pendingItems}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Need review
            </span>
          </div>
        </div>

        {/* 6. Total Transactions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Transactions
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <CreditCardIcon size={14} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-blue-600 font-heading">
              {loading ? "..." : totalTransactions}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Premium upgrades
            </span>
          </div>
        </div>
      </div>

      {/* Charts & Graphs Section (Assignment 9 Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart: 6 Metrics Visual Comparison */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-purple-500/10 text-purple-600">
                  <TrendingUpIcon size={16} />
                </span>
                <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                  Platform Statistics Bar Chart
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Visual comparison of registered users, menu items, and subscription transactions
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              Live Data
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-stone-100 dark:border-stone-800">
            {chartBars.map((bar) => {
              // Calculate bar height in percentage (min 8% so bar is visible)
              const heightPercent =
                maxBarValue > 0
                  ? Math.max(Math.round((bar.value / maxBarValue) * 100), 8)
                  : 8;

              return (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  {/* Value tag above bar */}
                  <span className="text-[11px] font-bold font-mono text-stone-700 dark:text-stone-300 mb-1.5 transition-transform group-hover:-translate-y-0.5">
                    {loading ? "..." : bar.value}
                  </span>

                  {/* The Vertical Bar */}
                  <div className="w-full max-w-[44px] bg-stone-100 dark:bg-stone-800/80 rounded-2xl p-1 flex items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-xl transition-all duration-500 ${bar.color}`}
                    />
                  </div>

                  {/* Label below bar */}
                  <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 dark:text-stone-400 mt-2 text-center truncate max-w-full">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-2 text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Users
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Vendors
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Customers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Menu Items
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Transactions
            </span>
          </div>
        </div>

        {/* Side Breakdown Charts: Distribution & Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
              Distribution Ratios
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Platform proportions and breakdown
            </p>

            <div className="space-y-6">
              {/* 1. User Distribution (Vendors vs Customers) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Users: Vendors vs Customers
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {totalVendors} / {totalCustomers}
                  </span>
                </div>
                {/* Visual Ratio Bar */}
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                  <div
                    style={{ width: `${vendorPercent}%` }}
                    className="bg-amber-500 h-full transition-all duration-500"
                    title={`Vendors: ${vendorPercent}%`}
                  />
                  <div
                    style={{ width: `${customerPercent}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Customers: ${customerPercent}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1.5">
                  <span className="text-amber-500 font-semibold">Vendors ({vendorPercent}%)</span>
                  <span className="text-emerald-500 font-semibold">Customers ({customerPercent}%)</span>
                </div>
              </div>

              {/* 2. Menu Items Status (Approved vs Pending) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Menu: Approved vs Pending
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {approvedMenuItems} / {pendingItems}
                  </span>
                </div>
                {/* Visual Ratio Bar */}
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                  <div
                    style={{ width: `${approvedPercent}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Approved: ${approvedPercent}%`}
                  />
                  <div
                    style={{ width: `${pendingPercent}%` }}
                    className="bg-orange-500 h-full transition-all duration-500"
                    title={`Pending: ${pendingPercent}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1.5">
                  <span className="text-emerald-500 font-semibold">Approved ({approvedPercent}%)</span>
                  <span className="text-orange-500 font-semibold">Pending ({pendingPercent}%)</span>
                </div>
              </div>

              {/* 3. Monetization: Premium Subscriptions */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Subscription Conversion
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {totalTransactions} premium
                  </span>
                </div>
                {/* Visual Ratio Bar */}
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                  <div
                    style={{ width: `${premiumPercent}%` }}
                    className="bg-blue-600 h-full transition-all duration-500"
                    title={`Premium: ${premiumPercent}%`}
                  />
                  <div
                    style={{ width: `${100 - premiumPercent}%` }}
                    className="bg-stone-300 dark:bg-stone-700 h-full transition-all duration-500"
                    title={`Standard: ${100 - premiumPercent}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1.5">
                  <span className="text-blue-500 font-semibold">Premium ({premiumPercent}%)</span>
                  <span className="text-stone-400">Standard ({100 - premiumPercent}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Assignment 9 Analytics</span>
            <span className="font-semibold text-emerald-500">Auto-calculated</span>
          </div>
        </div>
      </div>

      {/* Admin Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-purple-500/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <UsersIcon size={20} />
          </div>
          <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
            Manage Users
          </h4>
          <p className="text-xs text-stone-500">
            Search, filter, and block/unblock accounts across the platform.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/menu"
          className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-red-500/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <PizzaIcon size={20} />
          </div>
          <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
            Review Menu Items
          </h4>
          <p className="text-xs text-stone-500">
            Approve or reject newly submitted vendor recipes before they go live.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <CreditCardIcon size={20} />
          </div>
          <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
            Subscription Logs
          </h4>
          <p className="text-xs text-stone-500">
            Inspect verified Stripe checkout logs and vendor billing records.
          </p>
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN ROUTER FOR DASHBOARD OVERVIEW PAGE
// ============================================================================
export default function DashboardPage() {
  const { user } = useAuth();

  const role = user?.role || "customer";

  if (role === "vendor") {
    return <VendorOverview user={user} />;
  }

  if (role === "admin") {
    return <AdminOverview user={user} />;
  }

  // Default: Customer Dashboard Overview
  return <CustomerOverview user={user} />;
}
