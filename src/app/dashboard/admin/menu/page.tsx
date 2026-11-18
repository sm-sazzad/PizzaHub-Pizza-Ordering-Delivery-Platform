"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { PizzaIcon } from "@/components/ui/Icons";

interface MenuItem {
  id: string;
  itemName: string;
  vendorName: string;
  category: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  image?: string;
  createdAt: string;
}

export default function AdminMenuPage() {
  const toast = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAdminMenuItems = async () => {
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/admin/menu`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.items || [];
          setItems(list);
        }
      } catch {
        // Backend not yet reachable or empty DB; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminMenuItems();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    name: string,
    nextStatus: "approved" | "rejected",
  ) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/admin/menu/${id}/status`, {
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

    if (nextStatus === "approved") {
      toast.success(`"${name}" has been approved and is now live!`, "Item Approved");
    } else {
      toast.error(`"${name}" has been rejected.`, "Item Rejected");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Catalog Governance
          </span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-xs font-semibold text-stone-500">
            Menu Approvals
          </span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Review Menu Items
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Review new pizza recipes submitted by vendors. Approved pizzas are published to the public catalog.
        </p>
      </div>

      {/* Content */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-stone-500">
              Loading menu submissions...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <PizzaIcon size={28} />
            </div>
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
              No Menu Items Found
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              When vendors submit pizzas for approval, they will appear here for administrator review.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-heading font-bold text-sm text-stone-900 dark:text-white">
                      {item.itemName}
                    </h5>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        item.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : item.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Vendor: {item.vendorName} • {item.category} • ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateStatus(item.id, item.itemName, "rejected")
                        }
                        className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(item.id, item.itemName, "approved")
                        }
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
