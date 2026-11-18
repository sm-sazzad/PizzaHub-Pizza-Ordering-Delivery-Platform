"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  PizzaIcon,
  PlusCircleIcon,
  SparklesIcon,
} from "@/components/ui/Icons";

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

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Diavola Hot Honey",
    category: "Specialty / Gourmet Pizzas",
    price: 18.5,
    location: "Dhanmondi, Dhaka",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80",
    status: "approved",
    createdAt: "2026-11-15",
  },
  {
    id: "item-2",
    name: "Truffle Forest Mushroom",
    category: "Vegetarian Pizzas",
    price: 21.0,
    location: "Gulshan, Dhaka",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
    status: "approved",
    createdAt: "2026-11-16",
  },
  {
    id: "item-3",
    name: "Smoked Brisket & Fontina",
    category: "Meat Lovers",
    price: 22.5,
    location: "Banani, Dhaka",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80",
    status: "pending",
    createdAt: "2026-11-18",
  },
];

export default function MyMenuItemsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);

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

  const handleDelete = (id: string, name: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`"${name}" was removed from your menu.`, "Item Deleted");
  };

  const handleToggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const nextStatus = i.status === "inactive" ? "approved" : "inactive";
          toast.info(`Updated status to ${nextStatus}.`, "Status Changed");
          return { ...i, status: nextStatus };
        }
        return i;
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Menu Catalog
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              {user?.businessName || "My Restaurant"}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            My Menu Items
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Manage your published pizzas, update pricing, and monitor admin approval statuses.
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
            Free Plan Capacity: {items.filter((i) => i.status === "approved").length}/3 Active
          </span>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
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
                    {item.category} • <strong className="text-amber-600">${item.price.toFixed(2)}</strong>
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">{item.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                    item.status
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
      </div>

      {/* Upgrade Banner */}
      <div className="p-6 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <SparklesIcon size={20} />
          </div>
          <div>
            <h4 className="font-heading text-base font-bold">Need to publish unlimited pizzas?</h4>
            <p className="text-xs text-stone-400">
              Upgrade to the Premium Vendor Plan for unlimited listings and top homepage placement.
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
    </div>
  );
}
