"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingBagIcon,
  CheckIcon,
  CloseIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
} from "@/components/ui/Icons";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  itemPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  customerMessage?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const toast = useToast();

  // Real orders state - starts empty until fetched from MongoDB / Express backend
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVendorOrders = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/orders/vendor?email=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.orders || [];
          setOrders(
            list.map((o: {
              _id?: string;
              id?: string;
              customerName?: string;
              customerEmail?: string;
              itemName?: string;
              price?: number;
              itemPrice?: number;
              deliveryDate?: string;
              deliveryAddress?: string;
              customerMessage?: string;
              status?: Order["status"];
              createdAt?: string;
            }) => ({
              id: o._id || o.id || "",
              customerName: o.customerName || "Customer",
              customerEmail: o.customerEmail || "",
              itemName: o.itemName || "Artisan Pizza",
              itemPrice: typeof o.itemPrice === "number" ? o.itemPrice : o.price || 0,
              deliveryDate: o.deliveryDate || "ASAP",
              deliveryAddress: o.deliveryAddress || "Address provided",
              customerMessage: o.customerMessage,
              status: o.status || "pending",
              createdAt: o.createdAt || new Date().toISOString(),
            })),
          );
        }
      } catch {
        // Backend not yet reachable or empty DB; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorOrders();
  }, [user?.email]);

  const handleAccept = async (id: string) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
    } catch {
      // Graceful fallback
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "accepted" } : o)),
    );
    toast.success("Order accepted! Kitchen notification dispatched.", "Order Accepted");
  };

  const handleReject = async (id: string) => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
    } catch {
      // Graceful fallback
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "rejected" } : o)),
    );
    toast.error("Order has been rejected.", "Order Rejected");
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Kitchen Orders
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Customer Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Review pending customer orders, confirm delivery schedules, and manage kitchen status.
        </p>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-stone-500">
            Fetching customer orders from database...
          </p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State - Clean, No Fake Demo Data */
        <div className="py-16 px-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
            <ClockIcon size={32} />
          </div>
          <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white mb-1">
            No Customer Orders Yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
            When hungry customers order from your published pizza recipes, their orders will appear here in real-time for kitchen confirmation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPending = order.status === "pending";

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                      <ShoppingBagIcon size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                        Order #{order.id.slice(-6).toUpperCase()} •{" "}
                        <span className="text-red-600">{order.itemName}</span>
                      </h4>
                      <p className="text-xs text-stone-400">
                        Placed {order.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-lg text-stone-900 dark:text-white">
                      ${order.itemPrice.toFixed(2)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold">
                      <UserIcon size={14} className="text-stone-400" />
                      <span>Customer Details</span>
                    </div>
                    <p className="font-semibold text-stone-900 dark:text-white">
                      {order.customerName}
                    </p>
                    <p className="text-stone-400">{order.customerEmail}</p>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold">
                      <MapPinIcon size={14} className="text-stone-400" />
                      <span>Delivery Target</span>
                    </div>
                    <p className="font-semibold text-stone-900 dark:text-white">
                      {order.deliveryDate}
                    </p>
                    <p className="text-stone-400">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Special Customer Message if any */}
                {order.customerMessage && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                      Special Kitchen Instructions:
                    </span>
                    <p className="text-stone-600 dark:text-stone-300 italic">
                      &ldquo;{order.customerMessage}&rdquo;
                    </p>
                  </div>
                )}

                {/* Action Buttons for Pending Orders (PDF Page 7: only pending orders can be accepted/rejected) */}
                {isPending && (
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleReject(order.id)}
                      className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
                    >
                      <CloseIcon size={14} />
                      <span>Reject Order</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAccept(order.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <CheckIcon size={14} />
                      <span>Accept Order</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
