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
  EyeIcon,
} from "@/components/ui/Icons";
import { getTokenClient } from "@/lib/tokenAccess";
import { OrderCardSkeleton } from "@/components/ui/Skeleton";

export interface CustomerOrder {
  id: string;
  menuItemId?: string;
  itemId?: string;
  itemName: string;
  vendorName: string;
  quantity?: number;
  price: number;
  deliveryDate: string;
  deliveryAddress: string;
  customerMessage?: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "delivered"
    | "cancelled"
    | "cancled"
    | string;
  createdAt: string;
}

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const toast = useToast();

  // Real orders state - starts empty until fetched from MongoDB / Express
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Custom confirmation dialog state for canceling order
  const [orderToCancel, setOrderToCancel] = useState<{
    id: string;
    itemName: string;
  } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch customer orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${serverUrl}/orders?email=${encodeURIComponent(user.email)}`,
          {
            headers: {
              authorization: `Bearer ${await getTokenClient()}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.orders || [];
          setOrders(
            list.map((o: CustomerOrder & { _id?: string }, idx: number) => {
              // Ensure deliveryDate is never blank; fallback to createdAt
              const rawDate = o.deliveryDate || o.createdAt;
              let formattedDate = "Today (ASAP)";
              if (rawDate) {
                try {
                  const d = new Date(rawDate);
                  if (!isNaN(d.getTime())) {
                    formattedDate = d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  } else {
                    formattedDate = rawDate;
                  }
                } catch {
                  formattedDate = rawDate;
                }
              }

              return {
                ...o,
                id: o._id || o.id || `order-${idx}`,
                menuItemId: o.menuItemId || o.itemId,
                deliveryDate: formattedDate,
                customerMessage:
                  o.customerMessage ||
                  (o as { specialNotes?: string }).specialNotes ||
                  (o as { notes?: string }).notes ||
                  "",
              };
            }),
          );
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  // Execute cancel order after user confirms in the popup modal
  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/orders/${orderToCancel.id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${await getTokenClient()}`,
        },
        body: JSON.stringify({ email: user?.email }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const resData = await res.json();
      if (resData.modifiedCount > 0) {
        // Update order status to cancelled in local state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderToCancel.id ? { ...o, status: "cancelled" } : o,
          ),
        );
        toast.success(
          `Order for "${orderToCancel.itemName}" was cancelled.`,
          "Order Cancelled",
        );
        setOrderToCancel(null);
      } else {
        toast.error("Order could not be cancelled in database.", "Cancel Incomplete");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(`Failed to cancel order for "${orderToCancel.itemName}".`, "Action Failed");
    } finally {
      setIsCancelling(false);
    }
  };

  // Get status badge styling and icon (supports both "cancelled" and "cancled")
  const getStatusBadge = (status: CustomerOrder["status"]) => {
    const normalized = (status || "").toLowerCase();
    switch (normalized) {
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
      case "cancled":
        return {
          label: "Cancelled",
          style:
            "bg-stone-500/10 text-stone-500 dark:text-stone-400 border-stone-500/20",
          icon: CloseIcon,
        };
      default:
        return {
          label: status,
          style: "bg-stone-500/10 text-stone-500 border-stone-500/20",
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
            Review delivery schedules and order progress. Pending orders can be
            cancelled directly.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
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
            You haven&apos;t placed any orders yet. Discover authentic artisan
            pizzas from top verified kitchens and have them delivered piping hot
            to your doorstep.
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
          {orders.map((order, idx) => {
            const statusConfig = getStatusBadge(order.status);
            const StatusIcon = statusConfig.icon;
            const canCancel = order.status === "pending";

            return (
              <div
                key={order.id || `order-${idx}`}
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
                      {order.menuItemId ? (
                        <Link
                          href={`/menu/${order.menuItemId}`}
                          className="hover:text-red-600 transition-colors"
                        >
                          {order.itemName}
                        </Link>
                      ) : (
                        order.itemName
                      )}
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
                      <CalendarIcon
                        size={14}
                        className="text-amber-500 shrink-0"
                      />
                      <span>Delivery: {order.deliveryDate}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinIcon size={14} className="text-red-500 shrink-0" />
                      <span className="truncate max-w-xs">
                        {order.deliveryAddress}
                      </span>
                    </span>
                  </div>

                  {order.customerMessage && (
                    <div className="pt-1">
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 italic inline-block">
                        Note: &ldquo;{order.customerMessage}&rdquo;
                      </span>
                    </div>
                  )}
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

                  <div className="flex items-center gap-2">
                    {/* View Item Details Button */}
                    <Link
                      href={
                        order.menuItemId
                          ? `/menu/${order.menuItemId}`
                          : "/menu"
                      }
                      className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      title="View Pizza Details"
                    >
                      <EyeIcon size={14} />
                      <span>View</span>
                    </Link>

                    {canCancel ? (
                      <button
                        type="button"
                        onClick={() =>
                          setOrderToCancel({
                            id: order.id,
                            itemName: order.itemName,
                          })
                        }
                        className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400 text-xs font-semibold cursor-not-allowed"
                      >
                        {order.status === "cancelled" ||
                        order.status === "cancled"
                          ? "Cancelled"
                          : order.status === "rejected"
                            ? "Rejected"
                            : order.status === "delivered"
                              ? "Delivered"
                              : "Accepted"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-7 shadow-2xl space-y-5 text-center">
            {/* Alert Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircleIcon size={30} />
            </div>

            {/* Modal Heading & Description */}
            <div className="space-y-1.5">
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white">
                Cancel Pizza Order?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to cancel your order for{" "}
                <strong className="text-stone-800 dark:text-stone-200">
                  &ldquo;{orderToCancel.itemName}&rdquo;
                </strong>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setOrderToCancel(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={isCancelling}
                onClick={confirmCancelOrder}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
