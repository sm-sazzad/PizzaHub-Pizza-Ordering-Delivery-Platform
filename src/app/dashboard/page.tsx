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
          process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/orders/my-orders?email=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const orders = Array.isArray(data) ? data : data.orders || [];
          setRecentOrders(orders.slice(0, 5));
          setStats({
            totalOrders: orders.length,
            pendingOrders: orders.filter(
              (o: { status: string }) => o.status === "pending",
            ).length,
            acceptedOrders: orders.filter(
              (o: { status: string }) => o.status === "accepted",
            ).length,
            rejectedOrders: orders.filter(
              (o: { status: string }) => o.status === "rejected",
            ).length,
          });
        }
      } catch {
        // Backend not yet reachable or empty DB; keep initial clean states
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [user?.email]);

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
            {recentOrders.map((order) => (
              <div
                key={order.id}
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
  const [isLoading, setIsLoading] = useState(false);

  const isFreePlan = (user?.subscriptionPlan || "free") === "free";

  useEffect(() => {
    // When MongoDB backend is running, fetch real vendor counts
    const fetchVendorData = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";
        const [menuRes, ordersRes] = await Promise.all([
          fetch(
            `${serverUrl}/menu?vendorEmail=${encodeURIComponent(user.email)}`,
          ),
          fetch(
            `${serverUrl}/orders/vendor?email=${encodeURIComponent(user.email)}`,
          ),
        ]);

        let totalItems = 0;
        let activeItems = 0;
        let pending = 0;
        let accepted = 0;

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          const items = Array.isArray(menuData)
            ? menuData
            : menuData.items || [];
          totalItems = items.length;
          activeItems = items.filter(
            (i: { status: string }) => i.status === "approved",
          ).length;
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders = Array.isArray(ordersData)
            ? ordersData
            : ordersData.orders || [];
          pending = orders.filter(
            (o: { status: string }) => o.status === "pending",
          ).length;
          accepted = orders.filter(
            (o: { status: string }) => o.status === "accepted",
          ).length;
        }

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
            <span className="text-xs text-stone-400">
              / {isFreePlan ? "3 limit" : "unlimited"}
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
function AdminOverview({
  user,
}: {
  user: { name?: string; email?: string } | null;
}) {
  const [stats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    pendingItems: 0,
    totalTransactions: 0,
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
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
            Platform oversight, user management, recipe approvals, and financial
            transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
          <ShieldCheckIcon size={16} />
          <span>Superadmin Access</span>
        </div>
      </div>

      {/* 6 Stat Cards for Admin (Assignment 9 PDF Page 8) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Total Users
          </span>
          <span className="text-2xl font-black text-stone-900 dark:text-white font-heading">
            {stats.totalUsers}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Vendors
          </span>
          <span className="text-2xl font-black text-amber-600 font-heading">
            {stats.totalVendors}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Customers
          </span>
          <span className="text-2xl font-black text-emerald-600 font-heading">
            {stats.totalCustomers}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block mb-1">
            Menu Items
          </span>
          <span className="text-2xl font-black text-red-600 font-heading">
            {stats.totalMenuItems}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
            Pending Approval
          </span>
          <span className="text-2xl font-black text-orange-600 font-heading">
            {stats.pendingItems}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Transactions
          </span>
          <span className="text-2xl font-black text-stone-800 dark:text-stone-200 font-heading">
            {stats.totalTransactions}
          </span>
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
            Approve or reject newly submitted vendor recipes before they go
            live.
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
