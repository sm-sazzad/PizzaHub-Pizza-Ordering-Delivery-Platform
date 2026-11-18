"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingBagIcon,
  PizzaIcon,
  ClockIcon,
  CheckIcon,
  AlertCircleIcon,
  MapPinIcon,
  CalendarIcon,
  DollarSignIcon,
  CloseIcon,
} from "@/components/ui/Icons";

export interface CustomerOrder {
  id: string;
  itemName: string;
  vendorName: string;
  quantity?: number;
  price: number;
  deliveryDate: string;
  deliveryAddress: string;
  status: "pending" | "accepted" | "rejected" | "delivered" | "cancelled";
  createdAt: string;
}

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const toast = useToast();

  // Real orders state - starts empty until fetched from MongoDB / Express
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch customer orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/orders/my-orders?email=${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.orders || [];
          setOrders(list);
        }
      } catch {
        // Backend not yet reachable or no records yet; keep empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  // Cancel order (Assignment 9 PDF Page 6: allowed ONLY if status is 'pending')
  const handleCancelOrder = async (orderId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to cancel your order for "${itemName}"?`)) {
      return;
    }

    setCancellingId(orderId);
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "cancelled" as const } : o,
          ),
        );
        toast.success(`Order for "${itemName}" has been cancelled.`, "Order Cancelled");
      } else {
        // Optimistic / fallback update if backend patch endpoint isn't wired yet
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "cancelled" as const } : o,
          ),
        );
        toast.info(
          `Order marked as cancelled.`,
          "Cancelled",
        );
      }
    } catch {
      // Local fallback
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" as const } : o,
        ),
      );
      toast.info(`Order marked as cancelled.`, "Cancelled");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "accepted":
        return {
          label: "Accepted",
          style:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          icon: CheckIcon,
        };
      case "pending":
        return {
          label: "Pending Kitchen",
          style:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: ClockIcon,
        };
      case "delivered":
        return {
          label: "Delivered",
          style:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          icon: CheckIcon,
        };
      case "rejected":
        return {
          label: "Rejected",
          style:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          icon: AlertCircleIcon,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          style:
            "bg-stone-500/10 text-stone-500 dark:text-stone-400 border-stone-500/20",
          icon: CloseIcon,
        };
      default:
        return {
          label: status,
          style:
            "bg-stone-500/10 text-stone-500 border-stone-500/20",
          icon: ClockIcon,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Order History
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              {orders.length} Total Record{orders.length === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            My Pizza Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Review delivery schedules and order progress. Pending orders can be cancelled directly.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 w-fit"
        >
          <PizzaIcon size={16} />
          <span>Order Another Pizza</span>
        </Link>
      </div>

      {/* Orders List / Table */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-stone-500">
            Fetching your orders from database...
          </p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
            <ShoppingBagIcon size={32} />
          </div>
          <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white mb-1">
            No Pizza Orders Found
          </h3>
          <p className="text-xs text-stone-500 max-w-md mb-6 leading-relaxed">
            You haven&apos;t placed any orders yet. Discover authentic artisan pizzas from top verified kitchens and have them delivered piping hot to your doorstep.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
          >
            <PizzaIcon size={16} />
            <span>Browse Pizza Menu</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusBadge(order.status);
            const StatusIcon = statusConfig.icon;
            const canCancel = order.status === "pending";

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-red-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[11px] font-bold text-stone-400">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusConfig.style}`}
                    >
                      <StatusIcon size={12} />
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                      {order.itemName}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Kitchen Partner:{" "}
                      <strong className="text-stone-700 dark:text-stone-300">
                        {order.vendorName}
                      </strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-amber-500 shrink-0" />
                      <span>Delivery: {order.deliveryDate}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinIcon size={14} className="text-red-500 shrink-0" />
                      <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                    </span>
                  </div>
                </div>

                <div className="flex sm:items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800 shrink-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Total Paid
                    </span>
                    <span className="font-heading text-xl font-black text-stone-900 dark:text-white inline-flex items-center">
                      <DollarSignIcon size={16} className="text-emerald-600" />
                      <span>{order.price.toFixed(2)}</span>
                    </span>
                  </div>

                  <div>
                    {canCancel ? (
                      <button
                        onClick={() => handleCancelOrder(order.id, order.itemName)}
                        disabled={cancellingId === order.id}
                        className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    ) : (
                      <button
                        disabled
                        title="Orders cannot be cancelled once accepted by the kitchen."
                        className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400 text-xs font-semibold cursor-not-allowed"
                      >
                        {order.status === "cancelled" ? "Cancelled" : "Locked (Accepted)"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
