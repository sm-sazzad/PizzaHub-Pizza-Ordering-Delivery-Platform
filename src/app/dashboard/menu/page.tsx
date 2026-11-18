"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PizzaIcon, PlusCircleIcon, SparklesIcon } from "@/components/ui/Icons";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  location: string;
  image: string;
  status: "pending" | "approved" | "rejected" | "inactive";
  createdAt: string;
}

export default function MyMenuItemsPage() {
  const { user } = useAuth();
  const toast = useToast();

  // Real items state - starts empty until fetched from MongoDB / Express backend
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVendorMenuItems = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/menu?vendorEmail=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.items || [];
          setItems(
            list.map(
              (it: {
                _id?: string;
                id?: string;
                itemName?: string;
                name?: string;
                category?: string;
                price?: number;
                location?: string;
                images?: string[];
                image?: string;
                status?: MenuItem["status"];
                createdAt?: string;
              }) => ({
                id: it._id || it.id || "",
                name: it.itemName || it.name || "Artisan Pizza",
                category: it.category || "Classic Pizzas",
                price: typeof it.price === "number" ? it.price : 0,
                location: it.location || "Kitchen",
                image:
                  it.images?.[0] ||
                  it.image ||
                  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
                status: it.status || "pending",
                createdAt: it.createdAt || new Date().toISOString(),
              }),
            ),
          );
        }
      } catch {
        // Backend not yet reachable or empty DB; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorMenuItems();
  }, [user?.email]);

  const getStatusBadge = (status: MenuItem["status"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20";
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from your menu?`)) {
      return;
    }

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/menu/${id}`, {
        method: "DELETE",
      });
    } catch {
      // Ignored for graceful local fallback
    }

    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`"${name}" was removed from your menu.`, "Item Deleted");
  };

  const handleToggleAvailability = async (id: string) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;
    const nextStatus = current.status === "inactive" ? "approved" : "inactive";

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {
      // Graceful fallback
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: nextStatus } : i)),
    );
    toast.info(`Updated status to ${nextStatus}.`, "Status Changed");
  };

  const activeCount = items.filter((i) => i.status === "approved").length;
  const isFreePlan = (user?.subscriptionPlan || "free") === "free";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Kitchen Inventory
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              {items.length} Recipe{items.length === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            My Menu Items
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Manage your published pizzas, update active availability, or add new
            artisan recipes.
          </p>
        </div>

        <Link
          href="/dashboard/add-item"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all w-fit"
        >
          <PlusCircleIcon size={16} />
          <span>Add New Pizza</span>
        </Link>
      </div>

      {/* Items Table / Cards */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PizzaIcon size={18} className="text-red-600" />
            <h3 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              Published Pizzas ({items.length})
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            {isFreePlan
              ? `Free Plan Capacity: ${activeCount}/3 Active`
              : "Premium Plan: Unlimited"}
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-stone-500">
              Fetching menu items from database...
            </p>
          </div>
        ) : items.length === 0 ? (
          /* Empty State - Clean, No Fake Demo Data */
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
              <PizzaIcon size={32} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white mb-1">
              No Menu Items Published Yet
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
              Your kitchen doesn&apos;t have any pizza items listed yet. Add
              your artisan crust recipes and let hungry customers find your
              kitchen!
            </p>
            <Link
              href="/dashboard/add-item"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircleIcon size={16} />
              <span>Create Your First Recipe</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:border-stone-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-stone-200 dark:ring-stone-800 shrink-0 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {item.category} •{" "}
                      <strong className="text-amber-600">
                        ${item.price.toFixed(2)}
                      </strong>
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(item.id)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    {item.status === "inactive" ? "Activate" : "Deactivate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/40 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Banner for Free Plan */}
      {isFreePlan && (
        <div className="p-6 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <SparklesIcon size={20} />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold">
                Need to publish unlimited pizzas?
              </h4>
              <p className="text-xs text-stone-400">
                Upgrade to the Premium Vendor Plan for unlimited listings and
                top homepage placement.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider text-center shrink-0"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
